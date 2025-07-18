import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Método no permitido" });

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Error al parsear:", err);
        return res.status(400).json({ message: "Error al procesar el formulario" });
      }

      const { name, email, password, role } = fields;
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      const userExists = await db.user.findUnique({ where: { email: String(email) } });
      if (userExists) return res.status(400).json({ message: "El correo ya está registrado" });

      const hashedPassword = await hash(String(password), 10);

      // 📤 Subir imagen si se proporcionó
      let imageUrl: string | undefined;
      if (imageFile && "filepath" in imageFile) {
        const buffer = fs.readFileSync(imageFile.filepath);
        const ext = imageFile.originalFilename?.split(".").pop() || "jpg";
        const fileName = `profile-${randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("imagescerbrary")
          .upload(fileName, buffer, {
            contentType: imageFile.mimetype || "image/jpeg",
          });

        if (uploadError) {
          console.error("Error al subir la imagen:", uploadError);
          return res.status(500).json({ message: "No se pudo subir la imagen" });
        }

        const { data: publicUrl } = supabase.storage
          .from("profile-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl?.publicUrl;
      }

      await db.user.create({
        data: {
          name: String(name),
          email: String(email),
          password: hashedPassword,
          role: String(role) === "ADMIN" ? "ADMIN" : "USER",
          status: "PENDING",
          image: imageUrl,
        },
      });

      return res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (e) {
      console.error("Error general:", e);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  });
};

export default handler;

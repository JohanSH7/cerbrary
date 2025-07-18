import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["USER", "ADMIN"]),
  image: z.string().url("Imagen no válida").optional(), 
});

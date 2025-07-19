"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileImageUpload } from "@/components/molecules/profileImageUpload";
import { FormErrorMessage } from "@/components/atoms/formErrorMessage";

const registerSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Contraseña muy corta"),
  role: z.enum(["USER", "ADMIN"], {
    message: "Selecciona un rol",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface Props {
  switchToLogin: () => void;
}

export const RegisterForm = ({ switchToLogin }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    const values = getValues();

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role", values.role);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      switchToLogin();
    } else {
      console.error("Registro fallido");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setImageFile(file); // Guarda el archivo para el FormData
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <ProfileImageUpload imagePreview={imagePreview} onImageChange={handleImageUpload} />

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" placeholder="Juan Pérez" {...register("name")} />
        <FormErrorMessage message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" placeholder="correo@ejemplo.com" {...register("email")} />
        <FormErrorMessage message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="••••••" {...register("password")} />
        <FormErrorMessage message={errors.password?.message} />
      </div>

      <div>
        <Label htmlFor="role">Rol</Label>
        <select id="role" {...register("role")} className="border rounded-md px-3 py-2 w-full">
          <option value="">Seleccione una opción</option>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <FormErrorMessage message={errors.role?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registrando..." : "Registrarse"}
      </Button>
    </form>
  );
};

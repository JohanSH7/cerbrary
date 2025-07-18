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
  image: z.string().optional(),
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
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      const result = reader.result as string;
      setImagePreview(result);
      setValue("image", result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <ProfileImageUpload imagePreview={imagePreview} onImageChange={handleImageUpload} />
      <input type="hidden" {...register("image" as const)} />

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" placeholder="Juan Pérez" {...register("name" as const)} />
        <FormErrorMessage message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" placeholder="correo@ejemplo.com" {...register("email" as const)} />
        <FormErrorMessage message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="••••••" {...register("password" as const)} />
        <FormErrorMessage message={errors.password?.message} />
      </div>

      <div>
        <Label htmlFor="role">Rol</Label>
        <select id="role" {...register("role" as const)} className="border rounded-md px-3 py-2 w-full">
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

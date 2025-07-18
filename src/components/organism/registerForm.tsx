"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Contraseña muy corta"),
  role: z.enum(["USER", "ADMIN"], {
    message: "Selecciona un rol",
  }),
  image: z.instanceof(File).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    if (data.image) formData.append("image", data.image);

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      setShowDialog(true);
      reset();
      setImagePreview(null);

      setTimeout(() => {
        setShowDialog(false);
        onSuccess(); // Cambia a tab de login
      }, 3000);
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
      setValue("image", file); // importante: mantener el objeto File, no string base64
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-20 h-20">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="Preview" />
            ) : (
              <AvatarFallback>IMG</AvatarFallback>
            )}
          </Avatar>
          <label className="relative flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-primary text-white rounded-full px-4 py-2 text-sm text-center cursor-pointer">
              Subir imagen
            </div>
          </label>
        </div>

        <div>
          <Label htmlFor="name" className="mb-1 block">Nombre</Label>
          <Input id="name" placeholder="Juan Pérez" {...register("name" as const)} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="mb-1 block">Correo</Label>
          <Input id="email" placeholder="correo@ejemplo.com" {...register("email" as const)} />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1 block">Contraseña</Label>
          <Input id="password" type="password" placeholder="••••••" {...register("password" as const)} />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="role" className="mb-1 block">Rol</Label>
          <select
            id="role"
            {...register("role" as const)}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Seleccione una opción</option>
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <CheckCircle2 className="mx-auto text-green-500" size={50} />
            <DialogTitle className="text-xl mt-4">¡Registro exitoso!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Tu cuenta ha sido creada y está pendiente de aprobación por un administrador. Serás notificado cuando sea aprobada.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

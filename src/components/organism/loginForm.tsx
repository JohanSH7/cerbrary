"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoginDialog } from "@/components/molecules/loginDialog";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Contraseña muy corta"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: "",
    description: "",
  });

  const onSubmit = async (data: LoginFormValues) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (!res?.ok) {
      if (res?.error === "PENDING") {
        setDialog({
          open: true,
          title: "Cuenta pendiente",
          description: "Tu cuenta aún no ha sido aprobada por un administrador.",
        });
      } else if (res?.error === "REJECTED") {
        setDialog({
          open: true,
          title: "Cuenta rechazada",
          description: "Tu registro fue rechazado. Contacta con soporte si crees que es un error.",
        });
      } else {
        setDialog({
          open: true,
          title: "Error de inicio de sesión",
          description: "Correo o contraseña incorrectos.",
        });
      }
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Ingresar
        </Button>
      </form>

      <LoginDialog
        open={dialog.open}
        title={dialog.title}
        description={dialog.description}
        onClose={() =>
          setDialog({ open: false, title: "", description: "" })
        }
      />
    </>
  );
};

"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <Button
      className="bg-[#D5C2A5] hover:bg-[#c3b092] text-black"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Cerrar sesión
    </Button>
  );
};

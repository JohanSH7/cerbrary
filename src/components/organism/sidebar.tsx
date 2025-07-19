"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/atoms/logOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ArrowLeftRight,
  User,
} from "lucide-react";
import { getUserById } from "@/utils/api";
import { supabase } from "@/lib/supabaseClient";

export const Sidebar = () => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const role = session?.user?.role;

  const [userData, setUserData] = useState({
    name: "Usuario Anónimo",
    email: "Sin correo electrónico",
    avatar: "/placeholder.svg?height=40&width=40",
  });

  useEffect(() => {
    setIsClient(true);

    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        const user = await getUserById(session.user.id);

        let avatarUrl = "/placeholder.svg?height=40&width=40";

        if (user.image) {
          const filePath = user.image.trim().replace(/^\/+/, ""); // Asegúrate de que no tenga espacios

          const { data, error } = await supabase.storage
            .from("imagescerbrary")
            .createSignedUrl(filePath, 60 * 60 * 24); // 24h

          console.log("📸 Nombre archivo:", filePath);
          console.log("🔗 Signed URL generada:", data?.signedUrl);

          if (data?.signedUrl) {
            avatarUrl = data.signedUrl;
          } else if (error) {
            console.error("❌ Error al generar signed URL:", error.message);
          }
        }

        setUserData({
          name: user.name || "Usuario Anónimo",
          email: user.email || "Sin correo electrónico",
          avatar: avatarUrl,
        });
      } catch (error) {
        console.error("❌ Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [session]);

  const navigationItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Panel principal",
      allowedRoles: ["ADMIN", "USER"],
    },
    {
      href: "/Transactions",
      icon: ArrowLeftRight,
      label: "Transacciones",
      description: "Historial de movimientos",
      allowedRoles: ["ADMIN", "USER"],
    },
  ];

  const adminItems = [
    {
      href: "/admin/users",
      icon: Users,
      label: "Gestión de Usuarios",
      description: "Administrar usuarios del sistema",
    },
    {
      href: "/admin/book",
      icon: BookOpen,
      label: "Gestión de Libros",
      description: "Administrar biblioteca",
    },
    {
      href: "/admin/transacciones",
      icon: ArrowLeftRight,
      label: "Todas las Transacciones",
      description: "Ver todas las transacciones del sistema",
    },
  ];

  const filteredNavigation = navigationItems.filter((item) =>
    item.allowedRoles.includes(role as string)
  );

  return (
    <aside className="bg-gradient-to-br from-[#fffaf0] to-[#F3EEE7] backdrop-blur-sm border-r border-[#EADBC8] w-80 h-screen flex flex-col shadow-sm">
      {/* Parte superior: Información del usuario */}
      <div className="p-6 bg-gradient-to-r from-[#D5C2A5] to-[#EADBC8] border-b border-[#d4c0a2]">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14 ring-2 ring-[#B89F84] shadow-sm">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-[#B89F84] text-white">
              <User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-[#4B3C2A]">{userData.name}</p>
            <p className="text-sm text-[#7A6A58]">{userData.email}</p>
            {isClient && (
              <Badge
                className={`mt-2 text-xs font-medium px-3 py-1 rounded-full ${
                  role === "ADMIN"
                    ? "bg-[#8C735B] text-white"
                    : "bg-[#D5C2A5] text-[#4B3C2A]"
                }`}
              >
                {role === "ADMIN" ? "Administrador" : "Usuario"}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide px-3 py-2">
            Navegación Principal
          </h3>
          {filteredNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center px-4 py-3 text-sm rounded-xl hover:bg-[#F3EEE7] transition-all"
            >
              <item.icon className="mr-4 h-5 w-5 text-[#8C735B]" />
              <div className="flex-1">
                <div className="text-[#4B3C2A] font-medium">{item.label}</div>
                <div className="text-xs text-[#7A6A58]">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>

        {isClient && role === "ADMIN" && (
          <>
            <Separator className="my-4 bg-[#EADBC8]" />
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-[#7A6A58] uppercase tracking-wide px-3 py-2">
                Panel de Administración
              </h3>
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-sm rounded-xl hover:bg-[#f5f1ea] transition-all"
                >
                  <item.icon className="mr-4 h-5 w-5 text-[#8C735B]" />
                  <div className="flex-1">
                    <div className="text-[#4B3C2A] font-medium">{item.label}</div>
                    <div className="text-xs text-[#7A6A58]">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Cerrar sesión */}
      <div className="p-6 border-t border-[#EADBC8] bg-[#fdf9f4]">
        <LogoutButton />
      </div>
    </aside>
  );
};

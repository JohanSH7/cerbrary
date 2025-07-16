import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/atoms/logOut";

export const Sidebar = () => {
  const { data: session } = useSession();
  const role = session?.user.role;

  return (
    <aside className="bg-gray-100 p-4 w-64 min-h-screen flex flex-col justify-between">
      <nav className="space-y-2">
        <Link href="/dashboard" className="block">📊 Dashboard</Link>
        <Link href="/libros" className="block">📚 Libros</Link>

        {role === "ADMIN" && (
          <Link href="/usuarios" className="block">👥 Gestión de Usuarios</Link>
        )}

        <Link href="/transacciones" className="block">🔁 Transacciones</Link>
      </nav>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </aside>
  );
};

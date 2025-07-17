import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/atoms/logOut";
import { useEffect, useState } from "react";

export const Sidebar = () => {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const role = session?.user.role;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <aside className="bg-gray-100 p-4 w-64 min-h-screen flex flex-col justify-between dark:bg-gray-800">
      <nav className="space-y-2">
        <Link 
          href="/dashboard" 
          className="block px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          📊 Dashboard
        </Link>
        
        {isClient && role === "ADMIN" && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Administración
              </h3>
            </div>
            <Link 
              href="/admin/users" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              👥 Gestión de Usuarios
            </Link>
            <Link 
              href="/admin/book" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              📖 Gestión de Libros
            </Link>
            <Link 
              href="/admin/transacciones" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              🔁 Transacciones
            </Link>
          </>
        )}
      </nav>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </aside>
  );
};

import { Sidebar } from "@/components/organism/sidebar";
import { ReactNode } from "react";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fffaf0] via-[#F3EEE7] to-[#EADBC8]">
      {/* Sidebar fijo a la izquierda */}
      <div className="w-80 h-screen fixed top-0 left-0 z-10">
        <Sidebar />
      </div>

      {/* Contenido principal desplazado a la derecha del sidebar */}
      <main className="ml-80 flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-md border border-[#EADBC8] p-8 min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

import { DashboardLayout } from "@/components/templates/dashboardLayout";
import { withPageAuth } from "@/hooks/withPageAuth";
import { GetServerSideProps } from "next";

export default function UsuariosPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuth(
  async () => ({ props: {} }),
  { allowedRoles: ["ADMIN"] }
);

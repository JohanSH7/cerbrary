import { DashboardLayout } from "@/components/templates/dashboardLayout";
import { withPageAuth } from "@/hooks/withPageAuth";
import { GetServerSideProps } from "next";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Este panel es accesible por usuarios aprobados (ADMIN o USER).</p>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
  return {
    props: {},
  };
});
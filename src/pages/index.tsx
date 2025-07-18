"use client";

import { useWaitForSession } from "@/hooks/useWaitForSession";
import { AuthTemplate } from "@/components/templates/authTemplate";

export default function HomePage() {
  useWaitForSession(() => {
    window.location.href = "/dashboard";
  });

  return <AuthTemplate />;
}
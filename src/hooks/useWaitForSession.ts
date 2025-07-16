import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useWaitForSession(onReady: () => void) {
  const { status, data } = useSession();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked || status === "loading") return;

    if (status === "authenticated" && data?.user?.status === "APPROVED") {
      onReady();
      setChecked(true);
    }
  }, [status, data, checked, onReady]);
}

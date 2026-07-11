"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import Loading from "@/app/loading";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, user } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token && !user) {
      fetchUser().finally(() => {
        setInitialLoading(false);
      });
    } else {
      setInitialLoading(false);
    }
  }, [fetchUser, user]);

  if (initialLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}

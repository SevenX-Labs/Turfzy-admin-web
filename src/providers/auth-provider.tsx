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
    if (token) {
      // Set initial loading to false immediately to enable instant shell render.
      // If the token is expired/invalid, backend calls will trigger 401 and redirect.
      setInitialLoading(false);
      if (!user) {
        fetchUser().catch(() => {
          // Silent catch since interceptor/store handles redirect
        });
      }
    } else {
      setInitialLoading(false);
    }
  }, [fetchUser, user]);

  if (initialLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}

"use client";

import { createContext, useContext, useMemo } from "react";
import { createHttpClient } from "@/lib/http-client";
import { useAuth } from "@/context/AuthUserContext";
import { API_BASE_URL } from "@/lib/config";

const HttpClientContext = createContext<ReturnType<
  typeof createHttpClient
> | null>(null);

export const useHttp = () => {
  const ctx = useContext(HttpClientContext);
  if (!ctx) throw new Error("useHttp must be used within HttpClientProvider");
  return ctx;
};

export function HttpClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const client = useMemo(() => {
    return createHttpClient({
      getAccessToken: () => accessToken,
      refreshAccessToken,
      onAuthFailed: () => {
        logout().finally(() => {
          if (typeof window !== "undefined") window.location.href = "/login?redirected=true";
        });
      },
      baseURL: API_BASE_URL,
    });
  }, [accessToken, refreshAccessToken, logout]);

  return (
    <HttpClientContext.Provider value={client}>
      {children}
    </HttpClientContext.Provider>
  );
}

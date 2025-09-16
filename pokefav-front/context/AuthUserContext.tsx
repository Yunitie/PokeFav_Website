"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Type utilisateur (à adapter selon ton backend)
interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  // ... autres champs utilisateur
}

interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Valeur par défaut pour éviter les erreurs pendant l'hydratation
const defaultAuthContext: AuthContextType = {
  authUser: null,
  loading: true,
  accessToken: null,
  login: async () => {
    throw new Error("Auth context not initialized");
  },
  logout: async () => {
    throw new Error("Auth context not initialized");
  },
  refreshUser: async () => {
    throw new Error("Auth context not initialized");
  },
};

const AuthUserContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthUserProvider");
  }
  return context;
};

export const AuthUserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Appel au backend pour récupérer l'utilisateur courant
  const refreshUser = async () => {
    setLoading(true);
    try {
      console.log("AuthUserProvider - Vérification de l'utilisateur connecté");
      const res = await fetch("http://localhost:3001/api/profile", {
        credentials: "include",
      });
      if (res.ok) {
        const user = await res.json();
        console.log("AuthUserProvider - Utilisateur connecté:", user);
        setAuthUser(user);
      } else {
        console.log("AuthUserProvider - Aucun utilisateur connecté");
        setAuthUser(null);
      }
    } catch (e) {
      console.log("AuthUserProvider - Erreur lors de la vérification:", e);
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login : envoie email/mot de passe au backend, qui pose le cookie
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Connection error" }));
        throw new Error(errorData.error || "Connection error");
      }
      const data = await res.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      await refreshUser();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout : appelle le backend pour supprimer le cookie
  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Vérifie l'utilisateur au chargement (seulement côté client)
  useEffect(() => {
    console.log("AuthUserProvider - Initialisation du contexte");
    refreshUser();
    // tente d'obtenir un access token via refresh cookie httpOnly
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // backend lit le cookie
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.accessToken) setAccessToken(data.accessToken);
        }
      } catch {}
    })();
  }, []);

  const contextValue: AuthContextType = {
    authUser,
    loading,
    accessToken,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthUserContext.Provider value={contextValue}>
      {children}
    </AuthUserContext.Provider>
  );
};

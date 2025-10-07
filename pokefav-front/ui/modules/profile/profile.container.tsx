"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { useHttp } from "@/context/HttpClientContext";

export type ProfileViewProps = {
  displayName: string;
  email: string;
  onRequestPasswordReset: () => Promise<void>;
  onDeleteAccount: (confirmationText: string) => Promise<void>;
  loadingReset: boolean;
  loadingDelete: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
};

export function ProfileContainer() {
  const { authUser, loading: authLoading, logout } = useAuth();
  const http = useHttp();
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const displayName = authUser?.displayName ?? "Utilisateur";
  const email = authUser?.email ?? "";

  const onRequestPasswordReset = useCallback(async () => {
    if (!email) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingReset(true);
    try {
      await http.post("/api/auth/forgot-password", { email });
      setSuccessMessage(
        "Un email de modification du mot de passe a été envoyé."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message ?? "Erreur lors de l’envoi de l’email.");
      } else {
        setErrorMessage("Erreur lors de l’envoi de l’email.");
      }
    } finally {
      setLoadingReset(false);
    }
  }, [email, http]);

  const onDeleteAccount = useCallback(
    async (confirmationText: string) => {
      if (!authUser) return;
      setErrorMessage(null);
      setSuccessMessage(null);

      // petite sécurité côté front: exigez la saisie exacte du displayName
      if (confirmationText.trim() !== (authUser.displayName ?? "Utilisateur")) {
        setErrorMessage("Le texte de confirmation ne correspond pas.");
        return;
      }

      setLoadingDelete(true);
      try {
        await http.delete("/api/profile");
        setSuccessMessage("Compte supprimé. Déconnexion en cours...");
        await logout();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(
            err.message ?? "Erreur lors de la suppression du compte."
          );
        } else {
          setErrorMessage("Erreur lors de la suppression du compte.");
        }
      } finally {
        setLoadingDelete(false);
      }
    },
    [authUser, http, logout]
  );

  const viewProps: ProfileViewProps = useMemo(
    () => ({
      displayName,
      email,
      onRequestPasswordReset,
      onDeleteAccount,
      loadingReset,
      loadingDelete,
      errorMessage,
      successMessage,
    }),
    [
      displayName,
      email,
      onRequestPasswordReset,
      onDeleteAccount,
      loadingReset,
      loadingDelete,
      errorMessage,
      successMessage,
    ]
  );

  if (authLoading) {
    return <div className="p-6">Chargement…</div>;
  }
  if (!authUser) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return <ProfileView {...viewProps} />;
}

// Import tardif pour éviter les cycles si nécessaire
import { ProfileView } from "./profile.view";

export default ProfileContainer;

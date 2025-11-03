"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { useHttp } from "@/context/HttpClientContext";
import toast from "react-hot-toast";

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

  const displayName = authUser?.displayName ?? "User";
  const email = authUser?.email ?? "";

  const onRequestPasswordReset = useCallback(async () => {
    if (!email) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoadingReset(true);
    try {
      await http.post("/api/auth/forgot-password", { email });
      setSuccessMessage("A password reset email has been sent.");
      toast.success("Password reset email sent", { duration: 4000 });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message ?? "Error sending email.");
        toast.error(err.message ?? "Error sending email");
      } else {
        setErrorMessage("Error sending email.");
        toast.error("Error sending email");
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
      if (confirmationText.trim() !== (authUser.displayName ?? "User")) {
        setErrorMessage("The confirmation text does not match.");
        return;
      }

      setLoadingDelete(true);
      try {
        await http.delete("/api/profile");
        setSuccessMessage("Account deleted. Logging out...");
        toast.success("Account deleted", { duration: 4000 });
        await logout();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message ?? "Error deleting account.");
          toast.error(err.message ?? "Error deleting account");
        } else {
          setErrorMessage("Error deleting account.");
          toast.error("Error deleting account");
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
    return <div className="p-6">Loading…</div>;
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

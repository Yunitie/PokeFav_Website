"use client";

// Import des hooks React nécessaires
import { useState } from "react";
import React from "react";
// Import des hooks Next.js pour la navigation et les paramètres d'URL
import { useSearchParams } from "next/navigation";
import ForgotPasswordView from "./forgot-password.view";
import { API_BASE_URL } from "@/lib/config";
import { logger } from "@/lib/logger";

/**
 * Container de mot de passe oublié - Gère toute la logique métier de la page de récupération
 * Permet aux utilisateurs de demander une réinitialisation de leur mot de passe via un email
 */
export default function ForgotPasswordContainer() {
  // États locaux pour gérer le formulaire et l'interface utilisateur
  const [email, setEmail] = useState(""); // Email saisi par l'utilisateur
  const [error, setError] = useState(""); // Message d'erreur à afficher
  const [success, setSuccess] = useState(""); // Message de succès à afficher
  const [isLoading, setIsLoading] = useState(false); // État de chargement pendant l'envoi

  // const router = useRouter(); // Hook pour la navigation
  const searchParams = useSearchParams(); // Hook pour accéder aux paramètres d'URL

  // Effet pour vérifier les messages passés via les paramètres d'URL
  React.useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  /**
   * Gestionnaire de soumission du formulaire de récupération
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les messages d'erreur précédents
    setSuccess(""); // Réinitialise les messages de succès précédents
    setIsLoading(true); // Active l'état de chargement

    try {
      // Appel API pour envoyer l'email de récupération
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Succès - l'API a traité la demande
        setSuccess(
          data.message ||
            "If an account exists with this email, you will receive a recovery link in a few minutes."
        );
        // Réinitialisation du formulaire
        setEmail("");
      } else {
        // Erreur retournée par l'API
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      // Gestion des erreurs de réseau ou autres erreurs
      logger.error("Error during API call:", error);
      setError(
        "Unable to contact the server. Check your connection and try again."
      );
    } finally {
      // Désactivation de l'état de chargement dans tous les cas
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordView
      email={email}
      setEmail={setEmail}
      error={error}
      success={success}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}

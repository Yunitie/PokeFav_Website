"use client";

// Import des hooks React nécessaires
import { useState, useEffect } from "react";
import React from "react";
// Import des hooks Next.js pour la navigation et les paramètres d'URL
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { logger } from "@/lib/logger";
// Import des composants UI personnalisés
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";
import Layout from "@/ui/components/layout/layout";

/**
 * Page de réinitialisation de mot de passe - Permet aux utilisateurs de définir
 * un nouveau mot de passe après avoir cliqué sur le lien de récupération
 */
export default function ResetPasswordPage() {
  // États locaux pour gérer le formulaire et l'interface utilisateur
  const [newPassword, setNewPassword] = useState(""); // Nouveau mot de passe
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation du mot de passe
  const [error, setError] = useState(""); // Message d'erreur à afficher
  const [success, setSuccess] = useState(""); // Message de succès à afficher
  const [isLoading, setIsLoading] = useState(false); // État de chargement pendant la soumission
  const [isValidToken, setIsValidToken] = useState(false); // Vérification de la validité du token

  const router = useRouter(); // Hook pour la navigation
  const searchParams = useSearchParams(); // Hook pour accéder aux paramètres d'URL

  // Récupération des paramètres d'URL (token et email)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Vérification de la présence des paramètres requis
  useEffect(() => {
    if (!token || !email) {
      setError("Invalid reset link. Please use the link received by email.");
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [token, email]);

  /**
   * Gestionnaire de soumission du formulaire de réinitialisation
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les messages d'erreur précédents
    setSuccess(""); // Réinitialise les messages de succès précédents

    // Validation des mots de passe
    if (newPassword.length < 6) {
      setError("The password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsLoading(true); // Active l'état de chargement

    try {
      // Appel API pour réinitialiser le mot de passe
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Succès - le mot de passe a été réinitialisé
        setSuccess(data.message || "Password reset successfully!");
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push(
            "/login?message=Your password has been reset successfully. You can now log in.",
          );
        }, 3000);
      } else {
        // Erreur retournée par l'API
        setError(data.error || "An error occurred during the reset.");
      }
    } catch (error) {
      // Gestion des erreurs de réseau ou autres erreurs
      logger.error("Error during API call:", error);
      setError(
        "Unable to contact the server. Check your connection and try again.",
      );
    } finally {
      // Désactivation de l'état de chargement dans tous les cas
      setIsLoading(false);
    }
  };

  // Si le token n'est pas valide, afficher un message d'erreur
  if (!isValidToken) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]">
          <Container className="max-w-md w-full">
            <div className="bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Logo size="large" />
              </div>
              <Typography variant="h2" component="h1" className="mb-4">
                Invalid link
              </Typography>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <Typography variant="body-base" theme="danger">
                  {error}
                </Typography>
              </div>
              <Button action={() => router.push("/login/forgot-password")}>
                Request a new link
              </Button>
            </div>
          </Container>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Conteneur principal avec fond blanc et centrage vertical */}
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]">
        {/* Conteneur avec largeur maximale pour le formulaire */}
        <Container className="max-w-md w-full">
          {/* Carte contenant le formulaire avec bordure et coins arrondis */}
          <div className="bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-8">
            {/* Section d'en-tête avec logo et titre */}
            <div className="text-center mb-8">
              {/* Logo centré */}
              <div className="flex justify-center mb-4">
                <Logo
                  size="large"
                  color="black"
                  className="dark:fill-[#F3EDF5]"
                />
              </div>
              {/* Titre principal de la page */}
              <Typography
                variant="h2"
                component="h1"
                className="mb-2 text-black dark:text-white"
              >
                New password
              </Typography>
              {/* Sous-titre descriptif */}
              <Typography
                variant="body-sm"
                theme="gray"
                className="text-black dark:text-white"
              >
                Set your new password
              </Typography>
            </div>

            {/* Formulaire de réinitialisation */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ nouveau mot de passe */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your new password"
                />
              </div>

              {/* Champ confirmation du mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Confirm your new password"
                />
              </div>

              {/* Affichage des messages d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Typography variant="body-base" theme="danger">
                    {error}
                  </Typography>
                </div>
              )}

              {/* Affichage des messages de succès */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <Typography variant="body-base" theme="success">
                    {success}
                  </Typography>
                </div>
              )}

              {/* Bouton de réinitialisation avec gestion de l'état de chargement */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="small" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>

            {/* Section des liens additionnels */}
            <div className="mt-6 text-center">
              <Typography variant="body-base" theme="gray">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Log in
                </a>
              </Typography>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
}

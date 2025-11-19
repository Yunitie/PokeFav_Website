import React from "react";
// Import des composants UI personnalisés
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

interface ForgotPasswordViewProps {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  success: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * View de mot de passe oublié - Composant pure pour l'affichage du formulaire de récupération
 */
export default function ForgotPasswordView({
  email,
  setEmail,
  error,
  success,
  isLoading,
  onSubmit,
}: ForgotPasswordViewProps) {
  return (
    // Conteneur principal avec fond blanc et centrage vertical
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
                className="dark:fill-[#F5F5F5]"
              />
            </div>
            {/* Titre principal de la page */}
            <Typography
              variant="h2"
              component="h1"
              className="mb-2 text-black dark:text-white"
            >
              Forgot password
            </Typography>
            {/* Sous-titre descriptif */}
            <Typography
              variant="body-sm"
              theme="gray"
              className="text-black dark:text-gray-400"
            >
              Enter your email to receive a recovery link
            </Typography>
          </div>

          {/* Formulaire de récupération */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Champ email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-800 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
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

            {/* Bouton d'envoi avec gestion de l'état de chargement */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="small" />
                  Sending...
                </>
              ) : (
                "Send recovery link"
              )}
            </Button>
          </form>

          {/* Section des liens additionnels */}
          <div className="mt-6 text-center space-y-4">
            {/* Lien de retour vers la connexion */}
            <div>
              <Typography
                variant="body-base"
                theme="gray"
                className="text-black dark:text-gray-400"
              >
                Remember your password?{" "}
                <a
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Log in
                </a>
              </Typography>
            </div>
            {/* Lien vers la page d'inscription */}
            <div>
              <Typography
                variant="body-base"
                theme="gray"
                className="text-black dark:text-gray-400"
              >
                Don&apos;t have an account yet?{" "}
                <a
                  href="/login/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Create an account
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

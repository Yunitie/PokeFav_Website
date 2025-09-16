import React from "react";
// Import des composants UI personnalisés
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

interface LoginViewProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  success: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * View de connexion - Composant pure pour l'affichage du formulaire de connexion
 */
export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  error,
  success,
  isLoading,
  onSubmit,
}: LoginViewProps) {
  return (
    // Conteneur principal avec dégradé de fond et centrage vertical
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Conteneur avec largeur maximale pour le formulaire */}
      <Container className="max-w-md w-full">
        {/* Carte blanche contenant le formulaire avec ombre et coins arrondis */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Section d'en-tête avec logo et titre */}
          <div className="text-center mb-8">
            {/* Logo centré */}
            <div className="flex justify-center mb-4">
              <Logo size="large" />
            </div>
            {/* Titre principal de la page */}
            <Typography variant="h2" component="h1" className="mb-2">
              Login
            </Typography>
            {/* Sous-titre descriptif */}
            <Typography variant="body-sm" theme="gray">
              Sign in to your PokeFav account
            </Typography>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Champ email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Champ mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your password"
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

            {/* Bouton de connexion avec gestion de l'état de chargement */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="small" />
                  Logging in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Section des liens additionnels */}
          <div className="mt-6 text-center space-y-4">
            {/* Lien vers la page d'inscription */}
            <div>
              <Typography variant="body-base" theme="gray">
                Don&apos;t have an account yet?{" "}
                <a
                  href="/login/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Create an account
                </a>
              </Typography>
            </div>
            {/* Lien vers la page de récupération de mot de passe */}
            <div>
              <a
                href="/login/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

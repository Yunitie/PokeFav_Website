"use client";

// Import des hooks React nécessaires
import { useState } from "react";
import React from "react";
// Import des hooks Next.js pour la navigation et les paramètres d'URL
import { useRouter, useSearchParams } from "next/navigation";
// Import des composants UI personnalisés
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

/**
 * Page de mot de passe oublié - Permet aux utilisateurs de demander une réinitialisation
 * de leur mot de passe via un email de récupération
 */
export default function ForgotPasswordPage() {
  // États locaux pour gérer le formulaire et l'interface utilisateur
  const [email, setEmail] = useState(""); // Email saisi par l'utilisateur
  const [error, setError] = useState(""); // Message d'erreur à afficher
  const [success, setSuccess] = useState(""); // Message de succès à afficher
  const [isLoading, setIsLoading] = useState(false); // État de chargement pendant l'envoi

  const router = useRouter(); // Hook pour la navigation
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
      const response = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Succès - l'API a traité la demande
        setSuccess(data.message || "Si un compte existe avec cet email, vous recevrez un lien de récupération dans quelques minutes.");
        // Réinitialisation du formulaire
        setEmail("");
      } else {
        // Erreur retournée par l'API
        setError(data.error || "Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      // Gestion des erreurs de réseau ou autres erreurs
      console.error("Erreur lors de l'appel API:", error);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.");
    } finally {
      // Désactivation de l'état de chargement dans tous les cas
      setIsLoading(false);
    }
  };

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
              Mot de passe oublié
            </Typography>
            {/* Sous-titre descriptif */}
            <Typography variant="body-sm" theme="gray">
              Entrez votre email pour recevoir un lien de récupération
            </Typography>
          </div>

          {/* Formulaire de récupération */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Adresse email
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
                placeholder="votre@email.com"
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
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de récupération"
              )}
            </Button>
          </form>

          {/* Section des liens additionnels */}
          <div className="mt-6 text-center space-y-4">
            {/* Lien de retour vers la connexion */}
            <div>
              <Typography variant="body-base" theme="gray">
                Vous vous souvenez de votre mot de passe ?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Se connecter
                </a>
              </Typography>
            </div>
            {/* Lien vers la page d'inscription */}
            <div>
              <Typography variant="body-base" theme="gray">
                Pas encore de compte ?{" "}
                <a
                  href="/login/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Créer un compte
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

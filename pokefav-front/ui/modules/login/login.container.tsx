"use client";

// Import des hooks React nécessaires
import { useState } from "react";
import React from "react";
// Import des hooks Next.js pour la navigation et les paramètres d'URL
import { useRouter, useSearchParams } from "next/navigation";
// Import du contexte d'authentification personnalisé
import { useAuth } from "@/context/AuthUserContext";
import LoginView from "./login.view";
import { logger } from "@/lib/logger";

/**
 * Container de connexion - Gère toute la logique métier de la page de connexion
 * Utilise le contexte d'authentification pour gérer la connexion
 */
export default function LoginContainer() {
  // États locaux pour gérer le formulaire et l'interface utilisateur
  const [email, setEmail] = useState(""); // Email saisi par l'utilisateur
  const [password, setPassword] = useState(""); // Mot de passe saisi
  const [error, setError] = useState(""); // Message d'erreur à afficher
  const [success, setSuccess] = useState(""); // Message de succès à afficher
  const [info, setInfo] = useState(""); // Message d'information à afficher
  const [isLoading, setIsLoading] = useState(false); // État de chargement pendant la connexion

  // Récupération des fonctions et objets du contexte d'authentification
  const { login } = useAuth();
  const router = useRouter(); // Hook pour la navigation
  const searchParams = useSearchParams(); // Hook pour accéder aux paramètres d'URL

  // Effet pour vérifier les messages passés via les paramètres d'URL
  // Utile pour afficher des messages de succès après redirection (ex: après inscription)
  React.useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
    }
    // Vérifie si l'utilisateur a été redirigé vers cette page car l'authentification est requise
    const redirected = searchParams.get("redirected");
    if (redirected === "true") {
      setInfo("You must be logged in to access this page.");
    }
  }, [searchParams]);

  /**
   * Gestionnaire de soumission du formulaire de connexion
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les messages d'erreur précédents
    setIsLoading(true); // Active l'état de chargement

    try {
      // Tentative de connexion via le contexte d'authentification
      await login(email, password);
      // Redirection vers la page d'accueil après connexion réussie
      router.push("/");
    } catch (error) {
      // Gestion des erreurs de connexion
      // Récupère le message d'erreur depuis l'exception (qui vient de l'API)
      // Sanitize le message pour éviter d'exposer des informations sensibles
      let errorMessage = "Incorrect email or password";
      if (error instanceof Error) {
        const apiMessage = error.message;
        // Vérifier que le message ne contient pas d'informations sensibles (stack traces, etc.)
        // Mais autoriser tous les messages sûrs de l'API (rate limiting, validation, etc.)
        if (
          apiMessage &&
          !apiMessage.includes("stack") &&
          !apiMessage.includes("at ") &&
          !apiMessage.includes("Error:") &&
          apiMessage.length < 200
        ) {
          errorMessage = apiMessage;
        }
      }
      setError(errorMessage);
      logger.error(error);
    } finally {
      // Désactivation de l'état de chargement dans tous les cas
      setIsLoading(false);
    }
  };

  return (
    <LoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      success={success}
      info={info}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}

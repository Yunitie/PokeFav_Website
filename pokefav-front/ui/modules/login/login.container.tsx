"use client";

// Import des hooks React nécessaires
import { useState } from "react";
import React from "react";
// Import des hooks Next.js pour la navigation et les paramètres d'URL
import { useRouter, useSearchParams } from "next/navigation";
// Import du contexte d'authentification personnalisé
import { useAuth } from "@/context/AuthUserContext";
import LoginView from "./login.view";

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
      setError("Incorrect email or password");
      console.log(error);
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
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}

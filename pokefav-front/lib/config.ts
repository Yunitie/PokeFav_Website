/**
 * Configuration centralisée de l'application
 * Utilise les variables d'environnement avec des valeurs par défaut pour le développement
 */

// URL de base de l'API backend
// En production, doit être définie via NEXT_PUBLIC_API_URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// URL de base de l'API avec le préfixe /api
export const API_URL = `${API_BASE_URL}/api`;


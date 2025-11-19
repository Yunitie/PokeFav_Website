const rateLimit = require("express-rate-limit");

/**
 * Configuration des rate limiters pour protéger les endpoints sensibles
 *
 * Les rate limiters empêchent les attaques par force brute et le spam
 * en limitant le nombre de requêtes qu'un utilisateur peut faire dans un temps donné.
 *
 * Note: Le keyGenerator par défaut utilise req.ip qui gère correctement IPv4 et IPv6
 * grâce à la configuration "trust proxy" dans index.js
 */

/**
 * Rate limiter pour le login
 * Limite : 5 tentatives par 15 minutes par adresse IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives maximum
  message: {
    error: "Too many login attempts. Please wait and try again in 15 minutes.",
  },
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  // Utilise l'adresse IP par défaut (req.ip) qui gère correctement IPv4 et IPv6
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many login attempts. Please wait and try again in 15 minutes.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Rate limiter pour l'inscription
 * Limite : 3 comptes par heure par adresse IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 inscriptions maximum
  message: {
    error:
      "Too many registration attempts. Please wait and try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many registration attempts. Please wait and try again in 1 hour.",
      retryAfter: "1 hour",
    });
  },
});

/**
 * Rate limiter pour la demande de réinitialisation de mot de passe
 * Limite : 3 demandes par heure par adresse IP
 *
 * Note: On pourrait aussi limiter par email, mais cela nécessiterait
 * de parser le body de la requête, ce qui est plus complexe.
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 demandes maximum
  message: {
    error:
      "Too many password reset requests. Please wait and try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many password reset requests. Please wait and try again in 1 hour.",
      retryAfter: "1 hour",
    });
  },
});

/**
 * Rate limiter pour la réinitialisation de mot de passe (avec token)
 * Limite : 5 tentatives par 15 minutes par adresse IP
 */
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives maximum
  message: {
    error:
      "Too many password reset attempts. Please wait and try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many password reset attempts. Please wait and try again in 15 minutes.",
      retryAfter: "15 minutes",
    });
  },
});

/**
 * Rate limiter général pour les autres endpoints
 * Limite : 100 requêtes par 15 minutes par adresse IP
 *
 * Ce limiter peut être utilisé pour protéger les endpoints généraux
 * contre les abus, mais avec une limite plus permissive.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes maximum
  message: {
    error: "Too many requests. Please wait and try again in a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please wait and try again in a few minutes.",
      retryAfter: "a few minutes",
    });
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  generalLimiter,
};

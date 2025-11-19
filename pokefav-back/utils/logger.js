/**
 * Utilitaire de logging conditionnel
 * Les logs ne s'affichent qu'en développement
 */

const isDevelopment = process.env.NODE_ENV !== "production";

// Affiche la valeur actuelle de NODE_ENV au démarrage (toujours visible)
const nodeEnvValue = process.env.NODE_ENV || "not defined";
console.log(
  `[Logger] NODE_ENV = ${nodeEnvValue} | Mode: ${
    isDevelopment ? "DEVELOPMENT" : "PRODUCTION"
  }`
);

const logger = {
  /**
   * Log d'information (remplace console.log)
   * @param {...any} args - Arguments à logger
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log d'erreur (remplace console.error)
   * En production, on log seulement les erreurs critiques
   * @param {...any} args - Arguments à logger
   */
  error: (...args) => {
    // Les erreurs sont toujours loggées, mais on peut limiter les détails en production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // En production, on log seulement le message d'erreur sans stack trace détaillée
      const errorMessage = args
        .map((arg) => {
          if (arg instanceof Error) {
            return arg.message;
          }
          return String(arg);
        })
        .join(" ");
      console.error(`[ERROR] ${errorMessage}`);
    }
  },

  /**
   * Log d'avertissement (remplace console.warn)
   * @param {...any} args - Arguments à logger
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log d'information (remplace console.info)
   * @param {...any} args - Arguments à logger
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log de debug (seulement en développement)
   * @param {...any} args - Arguments à logger
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

module.exports = logger;

/**
 * Validation des variables d'environnement au démarrage
 * Assure que toutes les variables critiques sont définies avant de démarrer le serveur
 */

function validateEnv() {
  const errors = [];
  const warnings = [];
  const isProduction = process.env.NODE_ENV === "production";

  // Variables requises en toutes circonstances
  const requiredVars = [
    {
      name: "DATABASE_URL",
      message: "DATABASE_URL is required to connect to the database",
    },
    {
      name: "JWT_SECRET",
      message: "JWT_SECRET is required to sign authentication tokens",
    },
    {
      name: "JWT_REFRESH_SECRET",
      message: "JWT_REFRESH_SECRET is required to sign refresh tokens",
    },
  ];

  // Variables requises uniquement en production
  const productionRequiredVars = [
    {
      name: "FRONTEND_URL",
      message: "FRONTEND_URL is required in production for CORS configuration",
    },
  ];

  // Variables optionnelles (pour les fonctionnalités avancées)
  const optionalVars = [
    {
      name: "EMAIL_USER",
      message:
        "EMAIL_USER is recommended for sending emails (forgot password, etc.)",
    },
    {
      name: "EMAIL_PASSWORD",
      message:
        "EMAIL_PASSWORD is recommended for sending emails (forgot password, etc.)",
    },
  ];

  // Validation des variables requises
  for (const { name, message } of requiredVars) {
    if (!process.env[name] || process.env[name].trim() === "") {
      errors.push(`❌ ${message}`);
    }
  }

  // Validation des variables requises en production
  if (isProduction) {
    for (const { name, message } of productionRequiredVars) {
      if (!process.env[name] || process.env[name].trim() === "") {
        errors.push(`❌ ${message}`);
      }
    }
  }

  // Vérification des valeurs par défaut dangereuses en production
  if (isProduction) {
    if (
      process.env.JWT_SECRET === "dev-secret" ||
      process.env.JWT_SECRET === "votre_secret_jwt_tres_securise_ici"
    ) {
      errors.push("❌ JWT_SECRET must not use the default value in production");
    }
    if (
      process.env.JWT_REFRESH_SECRET === "dev-refresh-secret" ||
      process.env.JWT_REFRESH_SECRET ===
        "votre_refresh_secret_tres_securise_ici"
    ) {
      errors.push(
        "❌ JWT_REFRESH_SECRET must not use the default value in production"
      );
    }
  }

  // Avertissements pour les variables optionnelles
  const hasEmailUser =
    process.env.EMAIL_USER && process.env.EMAIL_USER.trim() !== "";
  const hasEmailPassword =
    process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.trim() !== "";

  if (!hasEmailUser || !hasEmailPassword) {
    warnings.push(
      "⚠️  EMAIL_USER and EMAIL_PASSWORD are not configured - email sending will be disabled"
    );
  } else if (hasEmailUser && !hasEmailPassword) {
    warnings.push(
      "⚠️  EMAIL_PASSWORD is missing - email sending will not work"
    );
  } else if (!hasEmailUser && hasEmailPassword) {
    warnings.push("⚠️  EMAIL_USER is missing - email sending will not work");
  }

  // Validation de la longueur des secrets JWT
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push(
      "⚠️  JWT_SECRET is too short (recommended minimum: 32 characters)"
    );
  }
  if (
    process.env.JWT_REFRESH_SECRET &&
    process.env.JWT_REFRESH_SECRET.length < 32
  ) {
    warnings.push(
      "⚠️  JWT_REFRESH_SECRET is too short (recommended minimum: 32 characters)"
    );
  }

  // Affichage des erreurs et warnings
  if (warnings.length > 0) {
    console.warn("\n⚠️  CONFIGURATION WARNINGS:");
    warnings.forEach((warning) => console.warn(warning));
    console.warn("");
  }

  if (errors.length > 0) {
    console.error("\n❌ CONFIGURATION ERRORS:");
    errors.forEach((error) => console.error(error));
    console.error(
      "\n💡 Make sure to define all required environment variables in your .env file"
    );
    console.error(
      "💡 Check env.example to see the complete list of required variables\n"
    );
    process.exit(1);
  }

  // Message de succès
  if (isProduction) {
    console.log("✅ All required environment variables are configured");
  } else {
    console.log("✅ Environment configuration validated (development mode)");
  }
}

module.exports = { validateEnv };

require("dotenv").config();

// Validation des variables d'environnement avant de continuer
const { validateEnv } = require("./config/env-validator");
validateEnv();

const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger/swagger");
const helmet = require("helmet");

const app = express();
const prisma = new PrismaClient();

// Configuration pour détecter l'IP réelle derrière un proxy (nginx, etc.)
// Nécessaire pour que le rate limiting fonctionne correctement
// Sécurité : On spécifie les IPs de confiance plutôt que de faire confiance au premier proxy
// En développement, on accepte localhost. En production, définir TRUSTED_PROXY_IPS dans .env
const trustedProxyIps = process.env.TRUSTED_PROXY_IPS
  ? process.env.TRUSTED_PROXY_IPS.split(",").map((ip) => ip.trim())
  : ["127.0.0.1", "::1"]; // Par défaut : localhost (dev uniquement)

if (process.env.NODE_ENV === "production" && !process.env.TRUSTED_PROXY_IPS) {
  console.warn(
    "⚠️  WARNING: TRUSTED_PROXY_IPS not set in production. Using default (localhost only)."
  );
}

app.set("trust proxy", trustedProxyIps);

// Helmet ajoute un ensemble de headers de sécurité côté navigateur
// Configuration simple pour ne pas casser Swagger ni le frontend
app.use(helmet());

// FRONTEND_URL est validé par env-validator.js (requis en production)
// En développement, on utilise une valeur par défaut si non défini
const frontendUrl =
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === "production" ? null : "http://localhost:3000");

if (!frontendUrl) {
  throw new Error("FRONTEND_URL must be defined in production");
}

app.use(
  cors({
    origin: frontendUrl,
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Configuration Swagger (seulement en développement)
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "PokeFav API Documentation",
    })
  );
}

// Importation des routes
const authLoginRouter = require("./api/auth/login/route");
const authRegisterRouter = require("./api/auth/register/route");
const authRefreshRouter = require("./api/auth/refresh/route");
const authLogoutRouter = require("./api/auth/logout/route");
const authForgotPasswordRouter = require("./api/auth/forgot-password/route");
const authResetPasswordRouter = require("./api/auth/reset-password/route");
const usersRouter = require("./api/users/route");
const profileRouter = require("./api/profile/route");
const pokemonByIdRouter = require("./api/pokemon/[id]/route");
const pokemonRandomRouter = require("./api/pokemon/random/route");
const pokemonRankRouter = require("./api/pokemon/rank/route");
const shareUserRouter = require("./api/share/user/route");

// Montage des routes
app.use("/api/auth/login", authLoginRouter);
app.use("/api/auth/register", authRegisterRouter);
app.use("/api/auth/refresh", authRefreshRouter);
app.use("/api/auth/logout", authLogoutRouter);
app.use("/api/auth/forgot-password", authForgotPasswordRouter);
app.use("/api/auth/reset-password", authResetPasswordRouter);
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);
app.use("/api/pokemon/random", pokemonRandomRouter);
app.use("/api/pokemon/rank", pokemonRankRouter);
app.use("/api/pokemon", pokemonByIdRouter);
app.use("/api/share/user", shareUserRouter);

// Middleware d'erreur centralisé (inclut les erreurs Prisma)
const logger = require("./utils/logger");
app.use((err, req, res, next) => {
  logger.error(err);

  // Erreurs connues Prisma (ex: contraintes d'unicité, problèmes de relation, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: contrainte d'unicité violée (email, etc.)
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "A resource with the same unique value already exists.",
      });
    }

    // Pour les autres codes Prisma connus, on reste générique mais explicite
    return res.status(400).json({
      error: "A database error occurred. Please try again.",
    });
  }

  // Erreurs Prisma de validation côté client (schéma, types...)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Invalid data provided.",
    });
  }

  // Fallback générique
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.log(`Backend server started on http://localhost:${PORT}`);
});

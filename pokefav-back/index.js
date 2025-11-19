require("dotenv").config();

// Validation des variables d'environnement avant de continuer
const { validateEnv } = require("./config/env-validator");
validateEnv();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger/swagger");

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

// Middleware d'erreur basique
const logger = require("./utils/logger");
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.log(`Backend server started on http://localhost:${PORT}`);
});

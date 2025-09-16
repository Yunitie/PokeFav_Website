require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./utils/swagger/swagger");

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:3000", // URL de votre frontend Next.js
    credentials: true, // Permet l'envoi de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Configuration Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PokeFav API Documentation",
  })
);

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
app.use("/api/pokemon", pokemonByIdRouter);
app.use("/api/pokemon/rank", pokemonRankRouter);

// Middleware d'erreur basique
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

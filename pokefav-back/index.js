const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Importation des routes
const authLoginRouter = require("./api/auth/login/route");
const authRegisterRouter = require("./api/auth/register/route");
const authRefreshRouter = require("./api/auth/refresh/route");
const usersRouter = require("./api/users/route");
const profileRouter = require("./api/profile/route");

// Montage des routes
app.use("/api/auth/login", authLoginRouter);
app.use("/api/auth/register", authRegisterRouter);
app.use("/api/auth/refresh", authRefreshRouter);
app.use("/api/users", usersRouter);
app.use("/api/profile", profileRouter);

// Middleware d'erreur basique
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

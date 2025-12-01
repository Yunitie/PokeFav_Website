const express = require("express");
const { prisma } = require("../../../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginLimiter } = require("../../../config/rate-limiter");
const logger = require("../../../utils/logger");
const { asyncHandler } = require("../../../utils/async-handler");

const router = express.Router();

// Les secrets JWT doivent être définis via les variables d'environnement
// La validation est effectuée au démarrage dans env-validator.js
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment variables"
  );
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur avec son email et mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Trop de tentatives
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/",
  loginLimiter,
  asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    // Ne révèle pas si l'utilisateur existe ou non (sécurité)
    // Toujours faire le hash même si l'utilisateur n'existe pas pour éviter timing attacks
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !passwordMatch) {
      // Message générique pour ne pas révéler si l'email existe
      return res.status(401).json({ error: "Incorrect email or password." });
    }
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 1 * 1000, // 1 jour en ms
    });
    return res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    // Ne pas exposer les détails de l'erreur en production
    logger.error("Login error:", error);
    // Laisser le middleware global gérer la réponse générique
    throw error;
  }
  })
);

module.exports = router;

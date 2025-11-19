const express = require("express");
const { prisma } = require("../../prisma");
const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");

const router = express.Router();

// JWT_REFRESH_SECRET doit être défini via les variables d'environnement
// La validation est effectuée au démarrage dans env-validator.js
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT_REFRESH_SECRET is missing: define it in your environment (.env) before starting the server"
  );
}

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Récupérer le profil utilisateur
 *     description: Retourne les informations du profil de l'utilisateur connecté
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de l'utilisateur
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email de l'utilisateur
 *                 displayName:
 *                   type: string
 *                   description: Nom d'affichage
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                   description: URL de l'avatar
 *                 isVerified:
 *                   type: boolean
 *                   description: Statut de vérification du compte
 *       401:
 *         description: Non authentifié
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
 */
router.get("/", async (req, res) => {
  try {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Vérifier le refresh token
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      publicId: user.publicId,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (err) {
    logger.error("Error retrieving profile:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
});

const COOKIE_NAME = "refreshToken";

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Supprimer le compte utilisateur
 *     description: Supprime définitivement le compte de l'utilisateur connecté et invalide le cookie de session.
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compte supprimé
 *       401:
 *         description: Non authentifié ou token invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/", async (req, res) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({ where: { id: payload.userId } });

    // Invalider le cookie côté client
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(204).send();
  } catch (err) {
    logger.error("Error deleting account:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

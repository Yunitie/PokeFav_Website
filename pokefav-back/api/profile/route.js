const express = require("express");
const { prisma } = require("../../prisma");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

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
      return res.status(401).json({ error: "Non authentifié" });
    }

    // Vérifier le refresh token
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Token invalide" });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération du profil:", err);
    return res.status(401).json({ error: "Token invalide" });
  }
});

module.exports = router;

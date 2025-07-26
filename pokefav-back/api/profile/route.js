const express = require("express");
const { prisma } = require("../../prisma");
const { requireAuth } = require("../../requireAuth");

const router = express.Router();

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
router.get("/", requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
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
});

module.exports = router;

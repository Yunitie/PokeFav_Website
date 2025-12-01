const express = require("express");
const { prisma } = require("../../prisma");
const { asyncHandler } = require("../../utils/async-handler");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (sans les mots de passe)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    return res.json(users);
  })
);

module.exports = router;

// Importation des modules nécessaires
const express = require("express");
const bcrypt = require("bcrypt");
const { prisma } = require("../../../prisma");
const { resetPasswordLimiter } = require("../../../config/rate-limiter");
const { validatePassword } = require("../../../utils/password-validator");
const { validateEmail } = require("../../../utils/email-validator");
const { asyncHandler } = require("../../../utils/async-handler");

// Création d'un nouveau routeur Express
const router = express.Router();

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialisation de mot de passe
 *     description: Réinitialise le mot de passe avec un token valide
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email', 'token', 'newPassword']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *               token:
 *                 type: string
 *                 description: Token de réinitialisation
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                 type: string
 *                 example: "Mot de passe réinitialisé avec succès."
 *       400:
 *         description: Données manquantes ou token invalide
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
  resetPasswordLimiter,
  asyncHandler(async (req, res) => {
    // Récupération des données depuis le corps de la requête
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      // Vérification des champs obligatoires
      return res
        .status(400)
        .json({ error: "Email, token et nouveau mot de passe requis." });
    }

    // Validation du format de l'email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // Validation de la force du nouveau mot de passe
    const { valid, error } = validatePassword(newPassword);
    if (!valid) {
      return res.status(400).json({ error });
    }

    // Recherche de l'utilisateur correspondant à l'email et au token
    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      !user.resetPasswordToken ||
      user.resetPasswordToken !== token ||
      !user.resetPasswordTokenExpiry ||
      user.resetPasswordTokenExpiry < new Date()
    ) {
      // Si l'utilisateur n'existe pas, ou le token est invalide/expiré
      return res
        .status(400)
        .json({ error: "Lien de réinitialisation invalide ou expiré." });
    }
    // Hachage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Mise à jour du mot de passe et suppression du token de réinitialisation
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    // Réponse de succès
    return res.json({ message: "Mot de passe réinitialisé avec succès." });
  })
);

// Export du routeur pour l'utiliser dans l'application principale
module.exports = router;

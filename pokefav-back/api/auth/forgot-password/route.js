// Importation des modules nécessaires
const express = require("express");
const crypto = require("crypto");
const { prisma } = require("../../../prisma");
const { sendMail } = require("../../../utils/mailer");
const logger = require("../../../utils/logger");
const { forgotPasswordLimiter } = require("../../../config/rate-limiter");
const { validateEmail } = require("../../../utils/email-validator");

// Création d'un nouveau routeur Express
const router = express.Router();

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     description: Envoie un email avec un lien de réinitialisation
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Email envoyé (si le compte existe)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Si un compte existe, un email a été envoyé."
 *       400:
 *         description: Email manquant
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
router.post("/", forgotPasswordLimiter, async (req, res) => {
  try {
    logger.debug("=== Forgot password request started ===");
    logger.debug("Environment variables:", {
      EMAIL_USER: process.env.EMAIL_USER ? "Defined" : "Missing",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "Defined" : "Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "Defined" : "Missing",
    });

    // Récupération de l'email depuis le corps de la requête
    const { email } = req.body;
    logger.debug("Email received:", email);

    if (!email) {
      logger.debug("Error: Email missing");
      return res.status(400).json({ error: "Email requis." });
    }

    // Validation du format de l'email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      logger.debug("Error: Invalid email format");
      return res.status(400).json({ error: emailValidation.error });
    }

    // Recherche de l'utilisateur correspondant à l'email
    logger.debug("Searching for user...");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      logger.debug("User not found");
      // Pour la sécurité, on ne révèle pas si l'email existe ou non
      return res.json({
        message: "Si un compte existe, un email a été envoyé.",
      });
    }

    logger.debug("User found, generating token...");
    // Génération d'un token sécurisé pour la réinitialisation
    const token = crypto.randomBytes(32).toString("hex");
    // Définition d'une date d'expiration (ici, 1 heure)
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1h

    // Mise à jour de l'utilisateur avec le token et la date d'expiration
    logger.debug("Updating user...");
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expiry,
      },
    });

    // Construction du lien de réinitialisation
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    logger.debug("Reset link generated");

    // Envoi de l'email de réinitialisation
    logger.debug("Attempting to send email...");
    try {
      await sendMail({
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetLink}">${resetLink}</a></p>`,
      });
      logger.debug("Email sent successfully");
    } catch (error) {
      logger.error("Error sending email:", error.message);
      logger.error("Stack trace:", error.stack);
      // On retourne quand même un succès pour ne pas révéler d'informations sensibles
      return res.json({
        message: "Si un compte existe, un email a été envoyé.",
      });
    }

    logger.debug("=== Forgot password request completed ===");
    // Réponse générique pour ne pas révéler si l'email existe ou non
    return res.json({ message: "Si un compte existe, un email a été envoyé." });
  } catch (error) {
    logger.error("General error in forgot-password:", error.message);
    logger.error("Stack trace:", error.stack);
    return res.status(500).json({ error: "Erreur serveur interne." });
  }
});

// Export du routeur pour l'utiliser dans l'application principale
module.exports = router;

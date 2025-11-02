// Importation des modules nécessaires
const express = require("express");
const crypto = require("crypto");
const { prisma } = require("../../../prisma");
const { sendMail } = require("../../../utils/mailer");

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
 */
router.post("/", async (req, res) => {
  try {
    console.log("=== Début de la requête forgot-password ===");
    console.log("Variables d'environnement:", {
      EMAIL_USER: process.env.EMAIL_USER ? "Définie" : "Manquante",
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "Définie" : "Manquante",
      DATABASE_URL: process.env.DATABASE_URL ? "Définie" : "Manquante",
    });

    // Récupération de l'email depuis le corps de la requête
    const { email } = req.body;
    console.log("Email reçu:", email);

    if (!email) {
      console.log("Erreur: Email manquant");
      return res.status(400).json({ error: "Email requis." });
    }

    // Recherche de l'utilisateur correspondant à l'email
    console.log("Recherche de l'utilisateur...");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("Utilisateur non trouvé");
      // Pour la sécurité, on ne révèle pas si l'email existe ou non
      return res.json({
        message: "Si un compte existe, un email a été envoyé.",
      });
    }

    console.log("Utilisateur trouvé, génération du token...");
    // Génération d'un token sécurisé pour la réinitialisation
    const token = crypto.randomBytes(32).toString("hex");
    // Définition d'une date d'expiration (ici, 1 heure)
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1h

    // Mise à jour de l'utilisateur avec le token et la date d'expiration
    console.log("Mise à jour de l'utilisateur...");
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
    console.log("Lien de réinitialisation généré:", resetLink);

    // Envoi de l'email de réinitialisation
    console.log("Tentative d'envoi d'email...");
    try {
      await sendMail({
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien : <a href="${resetLink}">${resetLink}</a></p>`,
      });
      console.log("Email envoyé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error.message);
      console.error("Stack trace:", error.stack);
      // On retourne quand même un succès pour ne pas révéler d'informations sensibles
      return res.json({
        message: "Si un compte existe, un email a été envoyé.",
      });
    }

    console.log("=== Fin de la requête forgot-password ===");
    // Réponse générique pour ne pas révéler si l'email existe ou non
    return res.json({ message: "Si un compte existe, un email a été envoyé." });
  } catch (error) {
    console.error("Erreur générale dans forgot-password:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({ error: "Erreur serveur interne." });
  }
});

// Export du routeur pour l'utiliser dans l'application principale
module.exports = router;

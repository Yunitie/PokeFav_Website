const nodemailer = require("nodemailer");
const logger = require("./logger");

// Transporteur configuré pour Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ton-email@gmail.com
    pass: process.env.EMAIL_PASSWORD, // mot de passe d'application Gmail
  },
});

/**
 * Envoie un email
 * @param {string} to Destinataire
 * @param {string} subject Sujet
 * @param {string} html Contenu HTML
 */
async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logger.debug(`Email sent to ${to}`);
  } catch (error) {
    logger.error("Error sending email:", error.message);
    throw new Error(
      "Impossible d'envoyer l'email. Vérifiez la configuration SMTP."
    );
  }
}

module.exports = { sendMail };

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     description: Déconnecte l'utilisateur en supprimant le cookie refresh token
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Déconnexion réussie."
 */
router.post("/", (req, res) => {
  // On supprime le cookie refreshToken
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return res.json({ message: "Déconnexion réussie." });
});

module.exports = router;

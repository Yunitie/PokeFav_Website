const express = require("express");
const jwt = require("jsonwebtoken");

// Route pour récupérer un nouveau token d'accès
const router = express.Router();

// Variables d'environnement pour les tokens
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     description: Génère un nouveau token d'accès à partir d'un refresh token
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['refreshToken']
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token JWT
 *     responses:
 *       200:
 *         description: Nouveau token d'accès généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Nouveau token d'accès JWT
 *       400:
 *         description: Refresh token manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Refresh token invalide ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token manquant." });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: "Refresh token invalide ou expiré." });
  }
});

module.exports = router;

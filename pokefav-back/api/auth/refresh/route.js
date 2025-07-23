const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

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

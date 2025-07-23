const express = require("express");
const { prisma } = require("../../prisma");
const { requireAuth } = require("../../requireAuth");

const router = express.Router();

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

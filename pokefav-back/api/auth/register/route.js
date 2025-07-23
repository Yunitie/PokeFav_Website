const express = require("express");
const { prisma } = require("../../../prisma");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "Cet email est déjà utilisé." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      displayName,
    },
  });

  return res.json({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  });
});

module.exports = router;

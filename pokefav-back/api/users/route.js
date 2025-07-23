const express = require("express");
const { prisma } = require("../../prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

module.exports = router;

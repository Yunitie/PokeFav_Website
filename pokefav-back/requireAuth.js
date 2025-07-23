const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Token invalide" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
}

module.exports = { requireAuth };

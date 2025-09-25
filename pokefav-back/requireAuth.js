const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET manquant: définis-le dans ton environnement (.env) avant de lancer le serveur"
  );
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Vous devez être connecté" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Vous devez être connecté" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Vous devez être connecté" });
  }
}

module.exports = { requireAuth };

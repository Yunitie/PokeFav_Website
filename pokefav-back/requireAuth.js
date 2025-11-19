const jwt = require("jsonwebtoken");

// JWT_SECRET must be defined via environment variables
// Validation is performed at startup in env-validator.js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing: define it in your environment (.env) before starting the server"
  );
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "You must be logged in" });
  }
}

module.exports = { requireAuth };

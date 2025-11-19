import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number; // (optionnel) date d'émission du token
    exp?: number; // (optionnel) date d'expiration du token
  }

// JWT_SECRET doit être défini via les variables d'environnement
// La validation est effectuée au démarrage dans env-validator.js
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing: define it in your environment (.env) before starting the server"
  );
}

// Après la vérification, on utilise une assertion de type pour indiquer à TypeScript
// que la valeur est garantie non-nulle (défense en profondeur)
const JWT_SECRET_SAFE = JWT_SECRET as string;

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET_SAFE);
  } catch (error) {
    return error;
  }
}


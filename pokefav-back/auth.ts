import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number; // (optionnel) date d'émission du token
    exp?: number; // (optionnel) date d'expiration du token
  }

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return error;
  }
}


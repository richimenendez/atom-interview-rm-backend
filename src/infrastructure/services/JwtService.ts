import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    // En producción, esto debería venir de variables de entorno
    this.secretKey = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
    this.expiresIn = '24h'; // Token válido por 24 horas
  }

  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: this.expiresIn as any,
      issuer: 'atomchat-api',
      audience: 'atomchat-users'
    };
    
    return jwt.sign(payload, this.secretKey, options);
  }

  verifyToken(token: string): JwtPayload {
    try {
      const options: VerifyOptions = {
        issuer: 'atomchat-api',
        audience: 'atomchat-users'
      };
      
      const decoded = jwt.verify(token, this.secretKey, options) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
} 
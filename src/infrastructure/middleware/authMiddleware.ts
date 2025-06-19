import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

const jwtService = new JwtService();

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Authorization header required with Bearer token',
        example: {
          'Authorization': 'Bearer your-jwt-token'
        }
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwtService.verifyToken(token);
      
      req.user = {
        uid: decoded.userId,
        email: decoded.email
      };
      
      next();
    } catch (tokenError) {
      if (tokenError instanceof Error) {
        if (tokenError.message === 'Token expired') {
          res.status(401).json({ error: 'Token expired' });
        } else {
          res.status(403).json({ error: 'Invalid token' });
        }
      } else {
        res.status(403).json({ error: 'Invalid token' });
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
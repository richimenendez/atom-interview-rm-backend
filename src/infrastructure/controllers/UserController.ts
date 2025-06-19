import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/user/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/user/LoginUserUseCase';
import { FirebaseUserRepository } from '../repositories/FirebaseUserRepository';
import { JwtService } from '../services/JwtService';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export class UserController {
  private registerUseCase: RegisterUserUseCase;
  private loginUseCase: LoginUserUseCase;
  private jwtService: JwtService;

  constructor() {
    const userRepository = new FirebaseUserRepository();
    this.registerUseCase = new RegisterUserUseCase(userRepository);
    this.loginUseCase = new LoginUserUseCase(userRepository);
    this.jwtService = new JwtService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await this.registerUseCase.execute(email);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists') {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await this.loginUseCase.execute(email);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Generar nuevo token con la información del usuario actual
      const newToken = this.jwtService.generateToken({
        userId: req.user.uid,
        email: req.user.email
      });

      res.status(200).json({
        token: newToken,
        userId: req.user.uid,
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 
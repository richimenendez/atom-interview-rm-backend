import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/ports/UserRepository';
import { JwtService } from '../../../infrastructure/services/JwtService';

export class LoginUserUseCase {
  private jwtService: JwtService;

  constructor(private userRepository: UserRepository) {
    this.jwtService = new JwtService();
  }

  async execute(email: string): Promise<{ user: User; token: string; userId: string }> {
    // Buscar usuario en nuestra base de datos
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generar JWT real para el usuario
    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email
    });

    return {
      user,
      token,
      userId: user.id
    };
  }
} 
import { User, UserEntity } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/ports/UserRepository';
import { JwtService } from '../../../infrastructure/services/JwtService';

export class RegisterUserUseCase {
  private jwtService: JwtService;

  constructor(private userRepository: UserRepository) {
    this.jwtService = new JwtService();
  }

  async execute(email: string): Promise<{ user: User; token: string; userId: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Crear usuario en nuestra base de datos
    const user = UserEntity.create(email);
    const createdUser = await this.userRepository.create(user);

    // Generar JWT real para el usuario recién creado
    const token = this.jwtService.generateToken({
      userId: createdUser.id,
      email: createdUser.email
    });

    return {
      user: createdUser,
      token,
      userId: createdUser.id
    };
  }
} 
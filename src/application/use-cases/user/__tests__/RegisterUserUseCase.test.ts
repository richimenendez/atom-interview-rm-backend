import { RegisterUserUseCase } from '../RegisterUserUseCase';
import { UserRepository } from '../../../../domain/ports/UserRepository';
import { User, UserEntity } from '../../../../domain/entities/User';

// Mock del repositorio
const mockUserRepository: jest.Mocked<UserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    registerUserUseCase = new RegisterUserUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = UserEntity.create(email);
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await registerUserUseCase.execute(email);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(UserEntity));
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(result.userId).toBe(mockUser.id);
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const email = 'existing@example.com';
      const existingUser = UserEntity.create(email);
      
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUserUseCase.execute(email)).rejects.toThrow('User already exists');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should generate JWT token for new user', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = UserEntity.create(email);
      
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await registerUserUseCase.execute(email);

      // Assert
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    });
  });
}); 
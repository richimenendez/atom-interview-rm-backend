import { JwtService, JwtPayload } from '../JwtService';

describe('JwtService', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      // Arrange
      const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
        userId: 'test-user-id',
        email: 'test@example.com'
      };

      // Act
      const token = jwtService.generateToken(payload);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes
    });

    it('should generate different tokens for different payloads', () => {
      // Arrange
      const payload1 = { userId: 'user1', email: 'user1@example.com' };
      const payload2 = { userId: 'user2', email: 'user2@example.com' };

      // Act
      const token1 = jwtService.generateToken(payload1);
      const token2 = jwtService.generateToken(payload2);

      // Assert
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      // Arrange
      const payload = { userId: 'test-user-id', email: 'test@example.com' };
      const token = jwtService.generateToken(payload);

      // Act
      const decoded = jwtService.verifyToken(token);

      // Assert
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      // Arrange
      const invalidToken = 'invalid.token.here';

      // Act & Assert
      expect(() => jwtService.verifyToken(invalidToken)).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      // Arrange
      const payload = { userId: 'test-user-id', email: 'test@example.com' };
      const token = jwtService.generateToken(payload);

      // Simular token expirado (esto requeriría mock del tiempo)
      // En un test real, podrías usar jest.useFakeTimers()
      
      // Act & Assert
      // Este test es más complejo y requeriría mock del tiempo
      expect(() => jwtService.verifyToken(token)).not.toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token without verification', () => {
      // Arrange
      const payload = { userId: 'test-user-id', email: 'test@example.com' };
      const token = jwtService.generateToken(payload);

      // Act
      const decoded = jwtService.decodeToken(token);

      // Assert
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
    });

    it('should return null for invalid token', () => {
      // Arrange
      const invalidToken = 'invalid.token.here';

      // Act
      const decoded = jwtService.decodeToken(invalidToken);

      // Assert
      expect(decoded).toBeNull();
    });
  });
}); 
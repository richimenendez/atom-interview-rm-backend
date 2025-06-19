import { Request, Response } from 'express';
import { UserController } from '../UserController';
import { UserEntity } from '../../../domain/entities/User';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    userController = new UserController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('register', () => {
    it('should return 400 when email is missing', async () => {
      // Arrange
      mockRequest = {
        body: {}
      };

      // Act
      await userController.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });

    it('should return 400 when email is empty string', async () => {
      // Arrange
      mockRequest = {
        body: { email: '' }
      };

      // Act
      await userController.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });

    it('should return 400 when email is undefined', async () => {
      // Arrange
      mockRequest = {
        body: { email: undefined }
      };

      // Act
      await userController.register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });
  });

  describe('login', () => {
    it('should return 400 when email is missing', async () => {
      // Arrange
      mockRequest = {
        body: {}
      };

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });

    it('should return 400 when email is empty string', async () => {
      // Arrange
      mockRequest = {
        body: { email: '' }
      };

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });

    it('should return 400 when email is undefined', async () => {
      // Arrange
      mockRequest = {
        body: { email: undefined }
      };

      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required'
      });
    });
  });

  describe('refreshToken', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      const mockAuthRequest: Partial<AuthenticatedRequest> = {
        user: undefined
      };

      // Act
      await userController.refreshToken(mockAuthRequest as AuthenticatedRequest, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not authenticated'
      });
    });

    it('should return 401 when user object is missing', async () => {
      // Arrange
      const mockAuthRequest: Partial<AuthenticatedRequest> = {};

      // Act
      await userController.refreshToken(mockAuthRequest as AuthenticatedRequest, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not authenticated'
      });
    });
  });
}); 
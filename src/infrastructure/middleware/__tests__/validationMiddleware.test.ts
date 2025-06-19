import { Request, Response, NextFunction } from 'express';
import { validateRequest, userSchemas } from '../validationMiddleware';
import Joi from 'joi';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('validateRequest', () => {
    it('should call next() when validation passes', () => {
      // Arrange
      const schema = Joi.object({
        email: Joi.string().email().required()
      });
      mockRequest.body = { email: 'test@example.com' };

      // Act
      validateRequest(schema)(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should return validation error when validation fails', () => {
      // Arrange
      const schema = Joi.object({
        email: Joi.string().email().required()
      });
      mockRequest.body = { email: 'invalid-email' };

      // Act
      validateRequest(schema)(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: expect.stringContaining('email')
          })
        ]),
        code: 'VALIDATION_ERROR'
      });
    });

    it('should strip unknown fields from request body', () => {
      // Arrange
      const schema = Joi.object({
        email: Joi.string().email().required()
      });
      mockRequest.body = { 
        email: 'test@example.com',
        unknownField: 'should be removed'
      };

      // Act
      validateRequest(schema)(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.body).toEqual({ email: 'test@example.com' });
    });
  });

  describe('userSchemas', () => {
    describe('register schema', () => {
      it('should validate valid registration data', () => {
        // Arrange
        const validData = { email: 'test@example.com' };

        // Act
        const { error } = userSchemas.register.validate(validData);

        // Assert
        expect(error).toBeUndefined();
      });

      it('should reject invalid email format', () => {
        // Arrange
        const invalidData = { email: 'invalid-email' };

        // Act
        const { error } = userSchemas.register.validate(invalidData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('Email debe ser una dirección válida');
      });

      it('should reject missing email', () => {
        // Arrange
        const invalidData = {};

        // Act
        const { error } = userSchemas.register.validate(invalidData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('Email es requerido');
      });
    });

    describe('login schema', () => {
      it('should validate valid login data', () => {
        // Arrange
        const validData = { email: 'test@example.com' };

        // Act
        const { error } = userSchemas.login.validate(validData);

        // Assert
        expect(error).toBeUndefined();
      });

      it('should reject invalid email format', () => {
        // Arrange
        const invalidData = { email: 'invalid-email' };

        // Act
        const { error } = userSchemas.login.validate(invalidData);

        // Assert
        expect(error).toBeDefined();
        expect(error?.details[0].message).toContain('Email debe ser una dirección válida');
      });
    });
  });
}); 
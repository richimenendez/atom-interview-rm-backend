import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Errores específicos de JWT
  if (error.message === 'Token expired') {
    res.status(401).json({
      error: 'Token expired',
      message: 'Your session has expired. Please login again.',
      code: 'TOKEN_EXPIRED'
    });
    return;
  }

  if (error.message === 'Invalid token') {
    res.status(403).json({
      error: 'Invalid token',
      message: 'The provided token is invalid.',
      code: 'INVALID_TOKEN'
    });
    return;
  }

  // Errores de validación
  if (error.message === 'Email is required') {
    res.status(400).json({
      error: 'Validation error',
      message: error.message,
      code: 'VALIDATION_ERROR'
    });
    return;
  }

  // Errores de negocio
  if (error.message === 'User not found') {
    res.status(404).json({
      error: 'User not found',
      message: 'No user found with the provided email.',
      code: 'USER_NOT_FOUND'
    });
    return;
  }

  if (error.message === 'User already exists') {
    res.status(409).json({
      error: 'User already exists',
      message: 'A user with this email already exists.',
      code: 'USER_EXISTS'
    });
    return;
  }

  // Error genérico
  res.status(error.statusCode || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.'
      : error.message,
    code: 'INTERNAL_ERROR'
  });
}; 
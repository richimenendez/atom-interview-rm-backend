import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        error: 'Validation error',
        details: errorDetails,
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

// Schemas de validación para usuarios
export const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email debe ser una dirección válida',
      'any.required': 'Email es requerido'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email debe ser una dirección válida',
      'any.required': 'Email es requerido'
    })
  })
};

// Schemas de validación para tareas
export const taskSchemas = {
  create: Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
      'string.min': 'El título debe tener al menos 1 carácter',
      'string.max': 'El título no puede exceder 100 caracteres',
      'any.required': 'El título es requerido'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    })
  }),

  update: Joi.object({
    title: Joi.string().min(1).max(100).optional().messages({
      'string.min': 'El título debe tener al menos 1 carácter',
      'string.max': 'El título no puede exceder 100 caracteres'
    }),
    description: Joi.string().max(500).optional().messages({
      'string.max': 'La descripción no puede exceder 500 caracteres'
    }),
    completed: Joi.boolean().optional()
  })
}; 
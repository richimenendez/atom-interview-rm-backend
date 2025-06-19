// Configuración global para tests
import { jest } from '@jest/globals';

// Configurar timeouts más largos para tests de integración
jest.setTimeout(10000);

// Mock de console.log para tests más limpios
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-only'; 
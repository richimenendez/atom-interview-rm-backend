import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRequest, userSchemas } from '../middleware/validationMiddleware';

const router = Router();
const userController = new UserController();

router.post('/register', validateRequest(userSchemas.register), (req, res) => userController.register(req, res));
router.post('/login', validateRequest(userSchemas.login), (req, res) => userController.login(req, res));
router.post('/refresh-token', authenticateToken, (req, res) => userController.refreshToken(req, res));

export default router; 
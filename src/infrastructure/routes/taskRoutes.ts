import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/authMiddleware';
import { verifyTaskOwnership } from '../middleware/taskOwnershipMiddleware';
import { validateRequest, taskSchemas } from '../middleware/validationMiddleware';

const router = Router();
const taskController = new TaskController();

// Aplicar autenticación a todas las rutas de tareas
router.use(authenticateToken);

// Obtener todas las tareas del usuario
router.get('/', (req, res) => taskController.getTasks(req, res));

// Obtener una tarea específica por ID (verificar propiedad)
router.get('/:id', verifyTaskOwnership, (req, res) => taskController.getTaskById(req, res));

// Crear una nueva tarea
router.post('/', validateRequest(taskSchemas.create), (req, res) => taskController.createTask(req, res));

// Actualizar una tarea (verificar propiedad)
router.put('/:id', verifyTaskOwnership, validateRequest(taskSchemas.update), (req, res) => taskController.updateTask(req, res));

// Eliminar una tarea (verificar propiedad)
router.delete('/:id', verifyTaskOwnership, (req, res) => taskController.deleteTask(req, res));

export default router; 
import { Request, Response, NextFunction } from 'express';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const verifyTaskOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const taskRepository = new FirebaseTaskRepository();
    const task = await taskRepository.findById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (task.userId !== userId) {
      res.status(403).json({ error: 'Access denied. You can only access your own tasks.' });
      return;
    }

    next();
  } catch (error) {
    console.error('Task ownership verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 
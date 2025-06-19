import { Request, Response } from 'express';
import { StorageService } from '../services/StorageService';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
  file?: any;
}

export class StorageController {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  async uploadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const userId = req.user?.uid || 'anonymous'; // Fallback si no hay autenticación
      const path = `users/${userId}/${Date.now()}-${req.file.originalname}`;
      
      const url = await this.storageService.uploadFile(req.file, path);
      res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { path } = req.params;
      await this.storageService.deleteFile(path);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getSignedUrl(req: Request, res: Response): Promise<void> {
    try {
      const { path } = req.params;
      const url = await this.storageService.getSignedUrl(path);
      res.status(200).json({ url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 
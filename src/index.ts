import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import './infrastructure/config/firebase';
import userRoutes from './infrastructure/routes/userRoutes';
import taskRoutes from './infrastructure/routes/taskRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app); 
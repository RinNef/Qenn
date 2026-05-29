import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { initializeDatabase } from './config/database';
import { setupSocketEvents } from './socket/events';

// Routes
import authRoutes from './routes/auth';
import deviceRoutes from './routes/devices';
import alertRoutes from './routes/alerts';
import maintenanceRoutes from './routes/maintenance';
import userRoutes from './routes/users';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Make io accessible to routes
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  setupSocketEvents(socket);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Qenn Highway Infrastructure Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      devices: '/api/devices',
      alerts: '/api/alerts',
      users: '/api/users',
      maintenance: '/api/maintenance',
    },
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize and start server
async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Start server
    server.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`WebSocket running on ws://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

start();

export default app;
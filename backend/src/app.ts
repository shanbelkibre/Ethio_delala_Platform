import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { storageConfig } from './config/storage';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import { setupSwagger } from './config/swagger';

export function createApp(): Express {
  const app = express();

  // Security & Parsing Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request Logging Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.originalUrl !== '/favicon.ico') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
      }
    });
    next();
  });

  // Root Health-check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'Ethiopian Property Platform API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Handle browser favicon requests cleanly (prevents 404 error logs in console)
  app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  // Swagger Interactive Documentation UI
  setupSwagger(app);

  // Static Public Uploads Serving
  app.use('/uploads', express.static(storageConfig.uploadDir));

  // Primary API Router
  app.use(env.API_PREFIX, routes);

  // 404 & Global Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

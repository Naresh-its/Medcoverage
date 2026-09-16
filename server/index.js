import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import medicalNeedsRoutes from './routes/medicalNeeds.js';
import zonesRoutes from './routes/zones.js';
import resourcesRoutes from './routes/resources.js';
import coverageRoutes from './routes/coverage.js';
import hospitalsRoutes from './routes/hospitals.js';
import routesRoutes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Request logger for API calls
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes mounting
app.use('/api', healthRoutes);
app.use('/api', medicalNeedsRoutes);
app.use('/api', zonesRoutes);
app.use('/api', resourcesRoutes);
app.use('/api', coverageRoutes);
app.use('/api', hospitalsRoutes);
app.use('/api', routesRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'MedCoverage Backend API Server',
    status: 'online',
    version: '2.0.0',
    documentation: '/api/health',
    endpoints: [
      'GET  /api/health',
      'GET  /api/medical-needs',
      'GET  /api/medical-needs/:id',
      'GET  /api/zones',
      'GET  /api/zones/:id',
      'GET  /api/resources',
      'GET  /api/resources/hospitals',
      'GET  /api/resources/blood-banks',
      'POST /api/coverage/evaluate',
      'POST /api/coverage/what-if',
      'POST /api/coverage/rank-interventions',
      'GET  /api/hospitals/ranked',
      'GET  /api/hospitals/:id/capability-profile',
      'POST /api/routes/evaluate'
    ]
  });
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(`🚀 MedCoverage Backend API Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`======================================================`);
  });
}

export default app;

require('dotenv').config();


const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');

const app = express();
const { port } = require('./config/config');
const authRoutes = require('./api/routes/auth');
const dashboardRoutes = require('./api/routes/dashboard');
const tasks = require('./api/routes/tasks');
const db = require('./models');
const logger = require('./logger');
const { swaggerUi, swaggerSpec } = require('./api/swagger');


app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasks);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
// In server.js
const apiRoutes = require('./api/routes/index');
app.use('/api', apiRoutes);  // Mounts all API routes under /api
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `${chalk.blue(req.method)} ${chalk.green(req.originalUrl)} ${chalk.yellow(
          res.statusCode
        )} ${chalk.magenta(duration + 'ms')}`
      );
    }
  });

  next();
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const { port } = require('./config/config');
const authRoutes = require('./api/routes/auth');
const dashboardRoutes = require('./api/routes/dashboard');
const tasks = require('./api/routes/tasks');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasks);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${chalk.blue(req.method)} ${chalk.green(req.originalUrl)} ${chalk.yellow(
        res.statusCode
      )} ${chalk.magenta(duration + 'ms')}`
    );
  });
  next();
});

module.exports = app;

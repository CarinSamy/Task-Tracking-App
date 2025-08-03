require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { port } = require('./config/config');
const authRoutes = require('./api/routes/auth');
const dashboardRoutes = require('./api/routes/dashboard');
const tasks = require('./api/routes/tasks');
const db = require('./models');
const morgan = require('morgan');

const chalk = require('chalk');
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



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
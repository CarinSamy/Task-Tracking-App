require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { port } = require('./config/config');
const authRoutes = require('./api/routes/auth');
const dashboardRoutes = require('./api/routes/dashboard');
const tasks = require('./api/routes/tasks');
const db = require('./models');


app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasks);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
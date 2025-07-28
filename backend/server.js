const express = require('express');
const postgresql = require('pg');
const cors = require('cors');
const db = require('./models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('./models');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

const authRoutes = require('./api/routes/auth');
const dashboardRoutes = require('./api/routes/dashboard');
const tasks = require('./api/routes/tasks');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', tasks);


app.listen(8081, () => {
  console.log('Server is running on port 8081');
});

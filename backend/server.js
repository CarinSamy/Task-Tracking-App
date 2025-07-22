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
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password.toString(), 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
    });

    return res.json({ Status: 'Success', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ Error: 'Registration failed' });
  }
});

const testAPIRoute = require('./api/routes/testAPI.js');
app.use('/testAPI', testAPIRoute);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Tracking App API');
});
app.listen(8081,()=> {
        console.log('Server is running on port 8081');
    });
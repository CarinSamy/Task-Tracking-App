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

const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/auth", authRoutes);


const testAPIRoute = require('./api/routes/testAPI.js');
app.use('/testAPI', testAPIRoute);
app.get('/', (req, res) => {
  res.send('Welcome to the Task Tracking App API');
});
app.listen(8081,()=> {
        console.log('Server is running on port 8081');
    });
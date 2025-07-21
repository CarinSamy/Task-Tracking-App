const express = require('express');
const postgresql = require('pg');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(express.json());
app.use(cors());
    app.listen(8081,()=> {
        console.log('Server is running on port 8081');
    });
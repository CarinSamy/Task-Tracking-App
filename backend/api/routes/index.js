const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file !== 'index.js' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const route = require(path.join(__dirname, file));
    router.use(route); // mount each route
  });

module.exports = router;


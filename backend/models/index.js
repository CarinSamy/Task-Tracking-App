'use strict';

require('dotenv').config(); // ✅ Load .env if needed

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const configFile = require(__dirname + '/../config/config.js');
const env = configFile.env || 'development';
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);

    console.log('Loading model file:', file, '| Exports:', typeof modelModule);

    if (typeof modelModule !== 'function') {
      throw new Error(`Model file ${file} does not export a function`);
    }

    const model = modelModule(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

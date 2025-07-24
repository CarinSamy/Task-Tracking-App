require('dotenv').config();
const { cleanEnv, str } = require('envalid');

// Validate ALL env variables used below
const env = cleanEnv(process.env, {
  DEV_DB_USERNAME: str(),
  DEV_DB_PASSWORD: str(),
  DEV_DB_NAME:     str(),
  DEV_DB_HOST:     str(),

  TEST_DB_USERNAME: str(),
  TEST_DB_PASSWORD: str(),
  TEST_DB_NAME:     str(),
  TEST_DB_HOST:     str(),

  PROD_DB_USERNAME: str(),
  PROD_DB_PASSWORD: str(),
  PROD_DB_NAME:     str(),
  PROD_DB_HOST:     str(),
});

module.exports = {
  development: {
    username: env.DEV_DB_USERNAME,
    password: env.DEV_DB_PASSWORD,
    database: env.DEV_DB_NAME,
    host:     env.DEV_DB_HOST,
    dialect:  'postgres',
  },
  test: {
    username: env.TEST_DB_USERNAME,
    password: env.TEST_DB_PASSWORD,
    database: env.TEST_DB_NAME,
    host:     env.TEST_DB_HOST,
    dialect:  'postgres',
  },
  production: {
    username: env.PROD_DB_USERNAME,
    password: env.PROD_DB_PASSWORD,
    database: env.PROD_DB_NAME,
    host:     env.PROD_DB_HOST,
    dialect:  'postgres',
  }
};


module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

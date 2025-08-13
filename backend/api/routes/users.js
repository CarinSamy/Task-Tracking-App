var express = require('express');
const { swaggerUi } = require('../swagger');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get the list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: respond with a resource
 */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

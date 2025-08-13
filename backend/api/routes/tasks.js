const express = require('express');
const router = express.Router();
const { Task } = require('../../models');
const authenticateToken = require('../../middleware/auth');
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: to-do
 *               estimate_hours:
 *                 type: number
 *               logged_hours:
 *                 type: number
 *     responses:
 *       201:
 *         description: Task created successfully
 *       500:
 *         description: Server error
 */

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description ,status,estimate_hours, logged_hours} = req.body;
    const statusMap = { "to-do": "To-Do", "in progress": "In_Progress", "completed": "Done" };
    const normstatus = statusMap[req.body.status] || req.body.status;

    const task = await Task.create({
      title,
      description,
      status: normstatus || 'To-Do',
      user_id: req.user.id,
      estimate_hours: parseFloat(estimate_hours) || 0,
      logged_hours: parseFloat(logged_hours) || 0,
    });

    

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Server error
 */

router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Server error
 */

// Get one task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               title: Updated title
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */


router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.body.status) {
      const statusMap = { 
        "to-do": "To-Do", 
        "in progress": "In_Progress", 
        "completed": "Done" 
      };
      req.body.status = statusMap[req.body.status.toLowerCase()] || req.body.status;
    }

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    console.error('PATCH error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
/**
 * @swagger
 * /api/tasks/{id}/log-time:
 *   post:
 *     summary: Log time to a task
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hours:
 *                 type: number
 *     responses:
 *       200:
 *         description: Time logged
 *       404:
 *         description: Task not found
 */

router.post('/:id/log-time', async (req, res) => {
  const { id: taskId } = req.params;
  const { hours } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.logged_hours = parseFloat(task.logged_hours || 0) + parseFloat(hours);
    await task.save();

    res.json({
      message: 'Time logged successfully',
      total_logged_hours: task.logged_hours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log time' });
  }
});
/**
 * @swagger
 * /api/tasks/{id}/update-time:
 *   put:
 *     summary: Update estimate or logged time
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estimate_hours:
 *                 type: number
 *               logged_hours:
 *                 type: number
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */


router.put('/:id/update-time', async (req, res) => {
  const { id } = req.params;
  const { estimate_hours, logged_hours } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (
      (estimate_hours !== undefined && estimate_hours < 0) ||
      (logged_hours !== undefined && logged_hours < 0)
    ) {
      return res.status(400).json({ error: 'Hours cannot be negative' });
    }

    if (estimate_hours !== undefined) {
      task.estimate_hours = parseFloat(estimate_hours);
    }

    if (logged_hours !== undefined) {
      task.logged_hours = parseFloat(logged_hours);
    }

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;

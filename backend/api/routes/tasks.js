const express = require('express');
const router = express.Router();
const { Task } = require('../../models');
const authenticateToken = require('../../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description ,status,estimate_hours, logged_hours} = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'to-do',
      user_id: req.user.id,
      estimate_hours: parseFloat(estimate_hours) || 0,
      logged_hours: parseFloat(logged_hours) || 0,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

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


router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

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

router.post('/tasks/:id/log-time', async (req, res) => {
  const { id: taskId } = req.params;
  const { hours } = req.body;

  try {
    const task = await db.Task.findByPk(taskId);
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


router.put('/tasks/:id/update-time', async (req, res) => {
  const { id } = req.params;
  const { estimated_hours, logged_hours } = req.body;

  try {
    const task = await db.Task.findByPk(id);
    if (!task) return res.status(404).send('Task not found');

    if (estimated_hours !== undefined) task.estimated_hours = parseFloat(estimated_hours);
    if (logged_hours !== undefined) task.logged_hours = parseFloat(logged_hours);

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




module.exports = router;

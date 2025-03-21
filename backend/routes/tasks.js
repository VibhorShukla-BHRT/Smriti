import express from 'express';
import { Task } from '../models/Task.js';

const router = express.Router();

// Get tasks for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const tasks = await Task.find({ date: new Date(date) });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
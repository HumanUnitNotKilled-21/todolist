const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../data/todos.json');

// GET all todos
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath);
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error reading todos' });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  try {
    const todos = JSON.parse(await fs.readFile(dataPath));
    const newTodo = {
      id: Date.now(),
      text: req.body.text,
      completed: false
    };
    todos.push(newTodo);
    await fs.writeFile(dataPath, JSON.stringify(todos, null, 2));
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error adding todo' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todos = JSON.parse(await fs.readFile(dataPath));
    const filtered = todos.filter(todo => todo.id !== parseInt(req.params.id));
    await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
});

module.exports = router;
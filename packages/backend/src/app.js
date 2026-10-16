const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for TODOs
let todos = [];
let nextId = 1;

// INTENTIONAL LINT VIOLATION (for Step 5-2): Unused variable should be removed or used
const unusedDebugFlag = true;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - Create a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);

  res.status(201).json(todo);
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title } = req.body;
  if (title !== undefined) {
    todo.title = title;
  }

  res.json(todo);
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
app.patch('/api/todos/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completed = !todo.completed;

  res.json(todo);
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const [deleted] = todos.splice(index, 1);
  res.json(deleted);
});

// INTENTIONAL ISSUE: Missing error handling middleware

module.exports = app;

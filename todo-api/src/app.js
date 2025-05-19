require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const todoRouter = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// API Key Authentication
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Routes
app.use('/api/todos', todoRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the ToDo List API!');
});


// Initialize data file
async function initializeDataFile() {
  const dataPath = path.join(__dirname, '../data/todos.json');
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, '[]');
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDataFile();
});

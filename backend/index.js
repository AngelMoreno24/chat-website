import express from 'express';
import cors from 'cors';    
import dotenv from 'dotenv';

const app = express();


// Enable Cors
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json()); // parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


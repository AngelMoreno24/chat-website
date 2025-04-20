import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // 👈 import your auth routes
dotenv.config();
import { sql, poolPromise } from './db.js'; // 👈 import your db connection

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); // 👈 use your auth routes

// Example: Use DB in a route
app.get('/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Users');
    res.json(result.recordset);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Server Error');
  }
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
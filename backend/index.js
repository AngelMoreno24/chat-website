import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // 👈 import your auth routes
import chatRoutes from './routes/chatRoutes.js'; // 👈 import your chat routes
import friendshipRoutes from './routes/friendshipRoutes.js'; // 👈 import your friendship routes
import messageRoutes from './routes/messageRoutes.js'; // 👈 import your message routes
import { verifyToken } from './middleware/verifyToken.js'; // 👈 import your middleware
import { sql, poolPromise } from './db.js'; // 👈 import your db connection


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); // 👈 use your auth routes

app.use("/chat", verifyToken, chatRoutes); // 👈 use your auth routes
app.use("/friendship", verifyToken, friendshipRoutes); // 👈 use your auth routes
app.use("/message", verifyToken, messageRoutes); // 👈 use your auth routes

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
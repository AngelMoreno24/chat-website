import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import friendshipRoutes from './routes/friendshipRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { verifyToken } from './middleware/verifyToken.js';
import { sql, poolPromise } from './db.js';

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Use frontend URL from env or allow all origins for testing
const url = process.env.FRONTEND_URL || '*';

const io = new Server(server, {
  cors: {
    origin: url,
    methods: ['GET', 'POST']
  }
});

// 💬 Socket.IO logic
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join_room', (chatId) => {
    socket.join(chatId);
    console.log(`📥 User ${socket.id} joined room ${chatId}`);
  });

  socket.on('send_message', (data) => {
    const { conversationId } = data;
    console.log(`📩 Broadcasting to room ${conversationId}:`, data);
    socket.to(conversationId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ✅ Middlewares and Routes
app.use(cors({ origin: url }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/chat", verifyToken, chatRoutes);
app.use("/friendship", verifyToken, friendshipRoutes);
app.use("/message", verifyToken, messageRoutes);

// ✅ Start server on Render-provided PORT
const PORT = process.env.PORT || 7145;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
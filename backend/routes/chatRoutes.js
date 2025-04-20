import express from 'express';
import { createChat, getChats, addChatMember } from '../controllers/chatController';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/create', verifyToken, createChat);

router.get('/getChats', verifyToken, getChats);

router.post('/addChatMember', verifyToken, addChatMember);

export default router;
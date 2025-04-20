import express from 'express';
import { createChat, getChats, addChatMember } from '../controllers/chatController';
const router = express.Router();

router.post('/create', createChat);

router.get('/getChats', getChats);

router.post('/addChatMember', addChatMember);

export default router;
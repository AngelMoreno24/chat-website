import express from 'express';
import { createChat, getChats, addChatMember, getChatMembers } from '../controllers/chatController.js';
 
const router = express.Router();

router.post('/create', createChat);

router.get('/getChats', getChats);

router.post('/addChatMember' , addChatMember);

router.post('/getChatMembers' , getChatMembers);

export default router;
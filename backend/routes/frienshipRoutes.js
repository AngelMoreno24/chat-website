import express from 'express';
import { addFriend } from '../controllers/friendshipController.js';

router = express.Router();


router.post('/addFriend', addFriend); 


export default router;
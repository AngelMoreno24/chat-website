import express from 'express';
import { addFriend, getRequests, acceptRequest } from '../controllers/friendshipController.js';

const router = express.Router();


router.post('/addFriend', addFriend); 
router.get('/getRequests', getRequests); 
router.post('/acceptRequest', acceptRequest); 

export default router;
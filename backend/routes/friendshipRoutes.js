import express from 'express';
import { addFriend, getRequests, acceptRequest, getFriends } from '../controllers/friendshipController.js';

const router = express.Router();


router.post('/addFriend', addFriend); 
router.get('/getRequests', getRequests); 
router.patch('/acceptRequest', acceptRequest); 
router.get('/getFriends', getFriends); 

export default router;
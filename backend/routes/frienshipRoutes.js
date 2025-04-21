import express from 'express';
import { addFriend, getRequests, acceptRequest } from '../controllers/friendshipController.js';

router = express.Router();


router.post('/addFriend', addFriend); 
router.post('/getRequests', getRequests); 
router.post('/acceptRequest', acceptRequest); 

export default router;
import express from 'express';
import { addFriend, getRequests } from '../controllers/friendshipController.js';

router = express.Router();


router.post('/addFriend', addFriend); 
router.post('/getRequests', getRequests); 


export default router;
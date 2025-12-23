import express from 'express';
import { getGroupChatHistory, markMessageSeen, getMessageSeenBy } from '../controllers/groupChatController.js';

const router = express.Router();


router.get('/history', getGroupChatHistory);
router.post('/seen-by/:id', markMessageSeen); // Mark message as seen
router.get('/seen-by/:id', getMessageSeenBy); // Get seenBy list

export default router;

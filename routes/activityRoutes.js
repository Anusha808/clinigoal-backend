import express from 'express';
import { getAllUserActivity } from '../controllers/userController.js';

const router = express.Router();

// Route to get all user activity logs
// GET /api/activity
router.get('/', getAllUserActivity);

export default router;
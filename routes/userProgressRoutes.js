import express from 'express';
import {
  getUserDetailedProgress,
  initializeProgress,
  updateVideoProgress,
  updateQuizScore,
  submitAssignment,
  generateCertificate,
} from '../controllers/userProgressController.js';

const router = express.Router();

// Admin route to get a user's full progress
router.get('/user/:userId', getUserDetailedProgress);

// Routes for updating progress (called by the frontend)
router.post('/initialize', initializeProgress);
router.put('/video', updateVideoProgress);
router.put('/quiz', updateQuizScore);
router.put('/assignment', submitAssignment);
router.put('/certificate', generateCertificate);

export default router;
// Use 'import' instead of 'require'
import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByCourseId,
  getReviewStats,
} from '../controllers/reviewController.js'; // <-- Make sure this path is correct and has .js

const router = express.Router();

// Route to get all reviews and to create a new review
router
  .route('/')
  .get(getAllReviews)
  .post(createReview);

// Route to get, update, or delete a specific review by its ID
router
  .route('/:id')
  .get(getReviewById)
  .put(updateReview)
  .delete(deleteReview);

// Bonus route: Get all reviews for a specific course
router.get('/course/:courseId', getReviewsByCourseId);

// Route for review statistics
router.get('/stats', getReviewStats);

// THIS IS THE MOST IMPORTANT LINE:
// Use 'export default' instead of 'module.exports'
export default router;
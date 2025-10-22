// Use 'import' instead of 'require'
import Review from '../models/Review.js';

// @desc    Create a new review
export const createReview = async (req, res) => {
  // ... (keep the function body the same)
  try {
    const { courseId, courseTitle, userId, userName, rating, review } = req.body;
    if (!courseId || !courseTitle || !userId || !userName || !rating || !review) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    const newReview = new Review({ courseId, courseTitle, userId, userName, rating, review });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(500).json({ message: 'Server Error: Could not create review.' });
  }
};

// @desc    Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch reviews.' });
  }
};

// @desc    Get a single review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch review.' });
  }
};

// @desc    Update a review
export const updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, review, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error.message);
    res.status(500).json({ message: 'Server Error: Could not update review.' });
  }
};

// @desc    Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review:', error.message);
    res.status(500).json({ message: 'Server Error: Could not delete review.' });
  }
};

// @desc    Get all reviews for a specific course
export const getReviewsByCourseId = async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching course reviews:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch reviews for this course.' });
  }
};

// @desc    Get overall review statistics
export const getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const ratings = await Review.find({}, 'rating');
    let averageRating = 0;
    if (ratings.length > 0) {
      const sumOfRatings = ratings.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (sumOfRatings / ratings.length).toFixed(1);
    }
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(review => {
      ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
    });
    res.status(200).json({ totalReviews, averageRating: parseFloat(averageRating), ratingCounts });
  } catch (error) {
    console.error('Error fetching review stats:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch review statistics.' });
  }
};
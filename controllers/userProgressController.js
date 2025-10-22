import UserProgress from '../models/UserProgress.js';
import Enrollment from '../models/Enrollment.js'; // Assuming you have this

// Helper function to find or create a progress document
const findOrCreateProgress = async (userId, courseId) => {
  let progress = await UserProgress.findOne({ userId, courseId });
  if (!progress) {
    progress = await UserProgress.create({ userId, courseId });
  }
  return progress;
};

// @desc    Get detailed progress for a single user across all courses
// @route   GET /api/progress/user/:userId
// @access  Private/Admin
export const getUserDetailedProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all progress records for the user and populate course details
    const progressRecords = await UserProgress.find({ userId })
      .populate('courseId', 'title description')
      .sort({ updatedAt: -1 });

    res.status(200).json(progressRecords);
  } catch (error) {
    console.error('Error fetching user progress:', error.message);
    res.status(500).json({ message: 'Server Error: Could not fetch user progress.' });
  }
};

// @desc    Initialize progress when a user is approved for a course
// @route   POST /api/progress/initialize
// @access  Private (called internally after approval)
export const initializeProgress = async (req, res) => {
  try {
    const { userId, courseId, videos } = req.body; // videos array from the course

    let progress = await UserProgress.findOne({ userId, courseId });
    if (progress) {
      return res.status(400).json({ message: 'Progress already initialized for this course.' });
    }

    // Initialize video progress with total duration
    const videoProgress = videos.map(video => ({
      videoId: video._id,
      totalDuration: video.duration || 0, // Assuming video has a duration field
    }));

    progress = await UserProgress.create({
      userId,
      courseId,
      videos: videoProgress,
    });

    res.status(201).json(progress);
  } catch (error) {
    console.error('Error initializing progress:', error.message);
    res.status(500).json({ message: 'Server Error: Could not initialize progress.' });
  }
};

// @desc    Update video watch time
// @route   PUT /api/progress/video
// @access  Private
export const updateVideoProgress = async (req, res) => {
  try {
    const { userId, courseId, videoId, watchedDuration, totalDuration } = req.body;
    
    const progress = await findOrCreateProgress(userId, courseId);
    const video = progress.videos.id(videoId);
    
    if (video) {
      video.watchedDuration = watchedDuration;
      video.totalDuration = totalDuration;
      video.isCompleted = watchedDuration >= (totalDuration * 0.9); // Mark as complete if 90% watched
    } else {
      progress.videos.push({ videoId, watchedDuration, totalDuration });
    }
    
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating video progress:', error.message);
    res.status(500).json({ message: 'Server Error: Could not update video progress.' });
  }
};

// @desc    Update quiz score
// @route   PUT /api/progress/quiz
// @access  Private
export const updateQuizScore = async (req, res) => {
  try {
    const { userId, courseId, score, totalQuestions } = req.body;
    
    const progress = await findOrCreateProgress(userId, courseId);
    
    progress.quiz.score = score;
    progress.quiz.totalQuestions = totalQuestions;
    progress.quiz.isPassed = score >= (totalQuestions / 2); // Pass if 50% or more
    progress.quiz.attempts.push({ score, date: new Date() });
    
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating quiz score:', error.message);
    res.status(500).json({ message: 'Server Error: Could not update quiz score.' });
  }
};

// @desc    Mark assignment as submitted
// @route   PUT /api/progress/assignment
// @access  Private
export const submitAssignment = async (req, res) => {
  try {
    const { userId, courseId, fileName } = req.body;
    
    const progress = await findOrCreateProgress(userId, courseId);
    
    progress.assignment.isSubmitted = true;
    progress.assignment.submissionDate = new Date();
    progress.assignment.fileName = fileName;
    
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error submitting assignment:', error.message);
    res.status(500).json({ message: 'Server Error: Could not submit assignment.' });
  }
};

// @desc    Mark certificate as generated
// @route   PUT /api/progress/certificate
// @access  Private
export const generateCertificate = async (req, res) => {
  try {
    const { userId, courseId, certificateId } = req.body;
    
    const progress = await findOrCreateProgress(userId, courseId);
    
    progress.certificate.isGenerated = true;
    progress.certificate.generatedDate = new Date();
    progress.certificate.certificateId = certificateId;
    
    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error generating certificate:', error.message);
    res.status(500).json({ message: 'Server Error: Could not update certificate status.' });
  }
};
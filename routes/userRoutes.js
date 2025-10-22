import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  // getAllUserActivity is no longer needed here
} from '../controllers/userController.js';

const router = express.Router();

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Admin Routes ---
// Route to get all users
// GET /api/users
router.route('/').get(getAllUsers);

// Route to get a single user or delete a user
// GET /api/users/:id
// DELETE /api/users/:id
router.route('/:id').get(getUserById).delete(deleteUser);

export default router;
const express = require('express');
const router = express.Router();
// --- UPDATED: Added updateAdminProfile to the import list ---
const { 
  registerUser, 
  loginUser, 
  getUsers, 
  createUser, 
  deleteUser, 
  updateUser,
  updateAdminProfile 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
// This route now correctly maps to the function in your controller
router.put('/profile', protect, updateAdminProfile); 

router.get('/', protect, getUsers);
router.post('/', protect, createUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
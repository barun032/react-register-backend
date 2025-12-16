const express = require('express');
const router = express.Router();
// Ensure registerUser is imported from controller
const { loginUser, registerUser } = require('../controllers/authController'); 
// Ensure middleware is imported
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// Route for POST /api/auth/login
router.post('/login', loginUser);

// Route for POST /api/auth/register
// This is the line that defines the route you are hitting
router.post('/register', protect, adminOnly, registerUser); 

module.exports = router;
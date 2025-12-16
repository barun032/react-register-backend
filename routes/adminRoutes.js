const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply protection middleware to all routes in this file
// Only logged-in Admins can access these
router.route('/users')
    .get(protect, adminOnly, getUsers);

router.route('/users/:id')
    .delete(protect, adminOnly, deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getOfficers, addOfficer, deleteOfficer } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply protection middleware to all routes in this file
// Only logged-in Admins can access these
router.route('/users')
    .get(protect, adminOnly, getUsers);

router.route('/users/:id')
    .delete(protect, adminOnly, deleteUser);

// Officer Management Routes (NEW)
router.route('/officers')
    .get(protect, getOfficers) // Allow non-admins to fetch list if needed (or add adminOnly)
    .post(protect, adminOnly, addOfficer);

router.route('/officers/:name') // Deleting by Name to match frontend
    .delete(protect, adminOnly, deleteOfficer);

module.exports = router;
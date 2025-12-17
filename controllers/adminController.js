const User = require('../models/User');
const Officer = require('../models/Officer')

// Get all the users (authorized person)
const getUsers = async (req, res) => {
    try {
        // CHANGE: Removed .select('-password') so we can display passwords for editors
        const users = await User.find({}); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete users
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent deleting Self Admin Account
            if (user._id.equals(req.user._id)) {
                return res.status(400).json({ message: "You cannot delete your own admin account." });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- OFFICER LOGIC (NEW) ---

// @desc Get all officers
// @route GET /api/admin/officers
const getOfficers = async (req, res) => {
    try {
        const officers = await Officer.find({});
        res.json(officers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add new officer
// @route POST /api/admin/officers
const addOfficer = async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await Officer.findOne({ name });
        if (exists) {
            return res.status(400).json({ message: 'Officer already exists' });
        }
        const officer = await Officer.create({ name });
        res.status(201).json(officer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete officer by NAME
// @route DELETE /api/admin/officers/:name
const deleteOfficer = async (req, res) => {
    try {
        const { name } = req.params;
        await Officer.findOneAndDelete({ name });
        res.json({ message: 'Officer removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, deleteUser, addOfficer, getOfficers, deleteOfficer };
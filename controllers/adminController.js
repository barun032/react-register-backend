const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        // Fetch all users but exclude the password field
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent deleting yourself (optional safety check)
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

module.exports = { getUsers, deleteUser };
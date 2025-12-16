const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    joined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
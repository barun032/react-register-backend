const mongoose = require('mongoose');

const officerSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Officer', officerSchema);
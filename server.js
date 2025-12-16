const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/admin', adminRoutes);

// Seed Admin User (Run once then comment out)
app.get('/seed', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    
    // Check if admin exists
    const exists = await User.findOne({ email: 'barun@gmail.com' });
    if(!exists) {
        await User.create({
            name: 'Admin User',
            email: 'barun@gmail.com',
            password: hashedPassword,
            role: 'admin'
        });
        res.send('Admin Created');
    } else {
        res.send('Admin already exists');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/admin', adminRoutes);

const seedAdminUser = async () => {
    try {
        // 1. Check if admin exists using the email from .env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log("Skipping Admin Seed: ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
            return;
        }

        const exists = await User.findOne({ email: adminEmail });

        // 2. If admin does not exist, create it
        if (!exists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await User.create({
                name: 'Admin MPB',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
        } else {
            console.log('Admin Account already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};



const startServer = async () => {
    try {
        await connectDB(); 
        await seedAdminUser(); 
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to connect to DB:", err);
    }
};

startServer();
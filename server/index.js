const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const seedAdmin = require('./seedAdmin');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artora-ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        // Seed admin user
        seedAdmin();
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/themes', require('./routes/themes'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Seed admin endpoint (one-time use)
app.get('/api/seed-admin', async (req, res) => {
    try {
        const User = require('./models/User');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@lazywalls.com' });

        if (existingAdmin) {
            return res.json({ message: 'Admin user already exists', email: 'admin@lazywalls.com' });
        }

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@lazywalls.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        res.json({
            message: 'Admin user created successfully',
            email: 'admin@lazywalls.com',
            password: 'admin123'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;

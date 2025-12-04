const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@lazywalls.com' });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }

        // Create admin user
        const admin = new User({
            name: 'Admin',
            email: 'admin@lazywalls.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log('   Email: admin@lazywalls.com');
        console.log('   Password: admin123');
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;

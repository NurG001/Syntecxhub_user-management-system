const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

// Connect to Database
connectDB();

const app = express();

// --- PRODUCTION CORS CONFIGURATION ---
// Restrict access to your specific frontend URL to prevent unauthorized API calls
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://staffsync-app.vercel.app' // Replace with your actual Vercel/Netlify URL
    : 'http://localhost:5173',               // Local Vite development URL
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// --- AUTOMATIC SEED SCRIPT ---
// Only runs if no admin exists to avoid accidental password resets in production
const seedAdmin = async () => {
  if (process.env.NODE_ENV === 'production') {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount > 0) return; // Skip seeding if an admin already exists
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      if (!adminUser.organization) {
        adminUser.organization = 'Headquarters'; 
        await adminUser.save();
        console.log('Admin organization field patched.');
      }
    } else {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        role: 'Admin',
        organization: 'Headquarters' 
      });
      console.log('Default Admin Account CREATED.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// --- MANUAL RESET ROUTE (DISABLED IN PRODUCTION) ---
// This route is removed in production for security
if (process.env.NODE_ENV !== 'production') {
  app.get('/reset-admin', async (req, res) => {
    try {
      await User.deleteMany({ email: 'admin@example.com' });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'Admin',
        organization: 'Headquarters'
      });
      
      res.send('<h1 style="color: green;">Admin Reset Successful (Development Mode)!</h1>');
    } catch (error) {
      res.status(500).send("Error resetting admin: " + error.message);
    }
  });
}

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server started on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  await seedAdmin(); 
});
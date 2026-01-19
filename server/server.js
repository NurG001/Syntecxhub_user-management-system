const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
const path = require('path'); // Added for path handling

// Connect to Database
connectDB();

const app = express();

// --- PRODUCTION MIDDLEWARE ---
// Standard security and parsing middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://staffsyncuser-management-system.vercel.app/' // Update this once you have your final Vercel URL
    : 'http://localhost:5173',               
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- HEALTH CHECK ROUTE ---
// Critical for Render to verify the service is "Live"
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "StaffSync API is running successfully",
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- API ROUTES ---
// Prefixing routes for clarity
app.use('/api/users', require('./routes/userRoutes'));

// --- AUTOMATIC SEED SCRIPT ---
// Ensures a default admin exists without overwriting existing data in production
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);

      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        role: 'Admin',
        organization: 'Headquarters' 
      });
      console.log('Default Admin Account CREATED successfully.');
    } else if (!adminUser.organization) {
      // Patch for older accounts missing the organization field
      adminUser.organization = 'Headquarters'; 
      await adminUser.save();
      console.log('Existing Admin organization field patched.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// --- MANUAL RESET ROUTE (DISABLED IN PRODUCTION) ---
// Security guard to prevent unauthorized database resets
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
      
      res.send('<h1 style="color: green;">Admin Reset Successful!</h1>');
    } catch (error) {
      res.status(500).send("Error resetting admin: " + error.message);
    }
  });
}

// --- START SERVER ---
// Uses dynamic port for cloud environments
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server started on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
  await seedAdmin(); 
});
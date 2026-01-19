const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

// Connect to Database
connectDB();

const app = express();

// --- STRICT PRODUCTION CORS ---
// Only allows requests from your live Vercel frontend
const corsOptions = {
  origin: 'https://staffsyncuser-management-system.vercel.app', // No trailing slash
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check for Render
app.get('/', (req, res) => {
  res.status(200).send("StaffSync API is Live");
});

// API Routes
app.use('/api/users', require('./routes/userRoutes'));

// --- PRODUCTION SEED SCRIPT ---
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);

      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        organization: 'Headquarters' 
      });
      console.log('Production Admin Created.');
    }
  } catch (error) {
    console.error('Seed Error:', error.message);
  }
};

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await seedAdmin();
  console.log(`Server running on port ${port}`);
});
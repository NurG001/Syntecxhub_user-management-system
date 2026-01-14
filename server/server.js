const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// --- AUTOMATIC SEED SCRIPT (Runs on Startup) ---
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const newPassword = 'admin123';
    
    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 2. Check if admin exists
    const adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      // FORCE UPDATE: Ensure admin has the correct password AND organization
      adminUser.password = hashedPassword;
      adminUser.role = 'Admin';
      // Critical Fix: Ensure existing admin has an organization field
      if (!adminUser.organization) {
        adminUser.organization = 'Headquarters'; 
      }
      await adminUser.save();
      console.log('-----------------------------------');
      console.log('Admin Account Sync Complete');
    } else {
      // CREATE: New admin with default organization
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '1234567890',
        role: 'Admin',
        organization: 'Headquarters' // <--- REQUIRED for new Schema
      });
      console.log('-----------------------------------');
      console.log('Admin Account CREATED Successfully!');
    }
    
    console.log(`Login: ${adminEmail}`);
    console.log(`Pass : ${newPassword}`);
    console.log('-----------------------------------');
    
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// --- MANUAL RESET ROUTE (Fixes "401" or Duplicate Issues) ---
// Visit http://localhost:5000/reset-admin to wipe and recreate admin
app.get('/reset-admin', async (req, res) => {
  try {
    // 1. Delete ALL users with this email
    await User.deleteMany({ email: 'admin@example.com' });
    
    // 2. Create new hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // 3. Create fresh admin with Organization
    await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'Admin',
      organization: 'Headquarters' // <--- REQUIRED
    });
    
    res.send(`
      <div style="font-family: sans-serif; padding: 20px;">
        <h1 style="color: green;">Admin Reset Successful!</h1>
        <p>Database cleaned. Default Admin restored.</p>
        <ul>
          <li>Organization: <b>Headquarters</b></li>
          <li>Email: <b>admin@example.com</b></li>
          <li>Password: <b>admin123</b></li>
        </ul>
        <a href="http://localhost:5173/login" style="background: blue; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
      </div>
    `);
  } catch (error) {
    res.status(500).send("Error resetting admin: " + error.message);
  }
});

// Start Server
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
  await seedAdmin(); // Run the seed logic immediately
});
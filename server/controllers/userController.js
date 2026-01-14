const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// @desc    Register a new Organization (Sign Up Page)
// @route   POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, organization } = req.body;

  if (!name || !email || !password || !organization) {
    res.status(400); throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name, email, phone, organization, password: hashedPassword, role: 'Admin'
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      organization: user.organization,
      token: generateToken(user._id)
    });
  } else {
    res.status(400); throw new Error('Invalid user data');
  }
});

// @desc    Update Admin Profile (Includes Password Change)
// @route   PUT /api/users/profile
// @access  Private
const updateAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    // If a new password is provided, hash it before saving
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      organization: updatedUser.organization,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add Employee (Inside Dashboard)
// @route   POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, role, password } = req.body;
  const organization = req.user.organization; 

  if (!name || !email || !role || !organization) {
    res.status(400); throw new Error('Missing fields');
  }

  const empPassword = password || '123456'; 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(empPassword, salt);

  const user = await User.create({
    name, email, phone, role, organization, password: hashedPassword
  });

  res.status(201).json(user);
});

// @desc    Get All Users (Filtered by Org)
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ organization: req.user.organization }).sort({ createdAt: -1 });
  res.status(200).json(users);
});

// @desc    Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id)
    });
  } else {
    res.status(400); throw new Error('Invalid credentials');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    
    if (user.organization !== req.user.organization) {
        res.status(401); throw new Error('Not authorized');
    }

    await user.deleteOne();
    res.status(200).json({ id: req.params.id });
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }

    if (user.organization !== req.user.organization) {
        res.status(401); throw new Error('Not authorized');
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
});

module.exports = { 
  registerUser, 
  loginUser, 
  getUsers, 
  createUser, 
  deleteUser, 
  updateUser,
  updateAdminProfile // <--- Export the new function
};
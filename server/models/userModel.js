const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'], unique: true },
    password: { type: String, required: [true, 'Please add a password'] },
    phone: { type: String, required: false },
    role: { type: String, default: 'User' },
    // --- NEW FIELD ---
    organization: { type: String, required: [true, 'Please add an organization'] } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
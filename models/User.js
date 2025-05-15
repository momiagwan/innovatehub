const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cnic: String,
  phone: String,
  HashedNtn: String,
  role: { type: String, enum: ['user', 'investor', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.models.User || mongoose.model('User', userSchema);

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { name, email, password, cnic, phone, ntn } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const role = ntn ? 'user' : 'user';
  const user = new User({ name, email, password: hashedPassword, cnic, phone, ntn, role });
  await user.save();
  res.status(201).json({ message: 'Registered. Awaiting verification if investor.' });
  console.log(hashedPassword)
};

// login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // optional: generate JWT here if needed
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ make sure this is present
      isVerified: user.isVerified,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    }
  });
};

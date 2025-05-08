const User = require('../models/User');

exports.getUnverifiedInvestors = async (req, res) => {
  const users = await User.find({ ntn: { $ne: null }, isVerified: false });
  res.json(users);
};

exports.verifyInvestor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.ntn) {
      return res.status(400).json({ error: 'User does not have an NTN' });
    }

    user.isVerified = true;
    user.role = 'investor';
    await user.save();

    return res.status(200).json({ message: 'Investor verified successfully' });
  } catch (err) {
    console.error('Error in verifyInvestor:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

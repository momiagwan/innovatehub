const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
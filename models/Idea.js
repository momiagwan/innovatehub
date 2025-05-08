const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: String,
  summary: String,
  description: String,
  investorNeeded: Boolean,
  developersNeeded: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

module.exports = mongoose.model('Idea', ideaSchema);
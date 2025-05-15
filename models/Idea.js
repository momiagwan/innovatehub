const mongoose = require('mongoose');
const { Schema } = mongoose;

const ideaSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String },
  investorNeeded: { type: Boolean, default: false },
  developersNeeded: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  viewers: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      viewedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.models.Idea || mongoose.model('Idea', ideaSchema);

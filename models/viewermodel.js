const mongoose = require('mongoose');

const viewerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Viewer', viewerSchema);

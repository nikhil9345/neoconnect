const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  option: { type: String, required: true },
});

// Compound index to ensure 1 vote per user per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);

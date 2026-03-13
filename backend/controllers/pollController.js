const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// @desc    Create a poll
// @route   POST /api/polls
// @access  Private (Secretariat, Admin)
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    const formattedOptions = options.map((opt, index) => ({
      optionIndex: index,
      count: 0
    }));

    const poll = await Poll.create({
      question,
      options,
      votes: formattedOptions,
      createdBy: req.user._id,
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all polls
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = req.params.id;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ pollId, userId: req.user._id });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }

    // Record vote
    await Vote.create({
      pollId,
      userId: req.user._id,
      option: poll.options[optionIndex]
    });

    // Update poll counts
    const optionToUpdate = poll.votes.find(v => v.optionIndex === optionIndex);
    if (optionToUpdate) {
      optionToUpdate.count += 1;
    }

    await poll.save();

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get poll results
// @route   GET /api/polls/:id/results
// @access  Private
const getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPoll, getPolls, votePoll, getPollResults };

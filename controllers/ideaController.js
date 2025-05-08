const Idea = require('../models/Idea');
const User = require('../models/User');
const Viewer = require('../models/viewermodel');

const createIdea = async (req, res) => {
  const { title, summary, description, investorNeeded, developersNeeded } = req.body;
  const idea = new Idea({ title, summary, description, investorNeeded, developersNeeded, createdBy: req.user.id });
  await idea.save();
  res.status(201).json(idea);
};

const getAllSummaries = async (req, res) => {
  const ideas = await Idea.find().select('title summary investorNeeded developersNeeded');
  res.json(ideas);
};

const getIdeaById = async (req, res) => {
  const ideaId = req.params.id;

  try {
    const idea = await Idea.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Log viewer
    const existingViewer = await Viewer.findOne({ userId: req.user._id, ideaId });
    if (!existingViewer) {
      await Viewer.create({ userId: req.user._id, ideaId });
    }

    res.json(idea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserIdeas = async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID from the request object

    // Find the ideas that belong to the logged-in user
    const ideas = await Idea.find({ createdBy: userId });

    if (ideas.length === 0) {
      return res.status(404).json({ message: 'No ideas found for this user' });
    }

    return res.status(200).json(ideas);
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getViewers = async (req, res) => {
  try {
    const viewers = await Viewer.find()
      .populate('userId', 'name')
      .populate('ideaId', 'title');

    const formatted = viewers.map(viewer => ({
      _id: viewer._id,
      name: viewer.userId?.name || 'Unknown',
      ideaId: viewer.ideaId?._id,
      ideaTitle: viewer.ideaId?.title || 'Unknown'
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error in getViewers:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createIdea,
  getAllSummaries,
  getIdeaById,
  getUserIdeas,
  getViewers
};

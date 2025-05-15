{/*const Idea = require('../models/Idea');
const User = require('../models/User');

const Viewer = require('../models/viewermodel');

const createIdea = async (req, res) => {
  const { title, summary, description, investorNeeded, developersNeeded } = req.body;
  const idea = new Idea({ title, summary, description, investorNeeded, developersNeeded, createdBy: req.user.id });
  await idea.save();
  res.status(201).json(idea);
};

getAllSummaries = async (req, res) => {
  try {
    const userId = req.user._id;
    const isInvestor = req.user.role === 'investor';

  const ideas = await Idea.find()
  .populate('createdBy', 'name')
  .populate({
    path: 'comments',
    populate: {
      path: 'userId',
      model: 'User',
      select: 'name'  // This is key to show investor name
    }
  });


    const result = ideas.map((idea) => {
      const isMyIdea = idea.createdBy._id.toString() === userId.toString();
      return {
        _id: idea._id,
        title: idea.title,
        summary: idea.summary,
        investorNeeded: idea.investorNeeded,
        developersNeeded: idea.developersNeeded,
        createdBy: idea.createdBy._id,
        creatorName: idea.createdBy.name,
        description: isMyIdea || isInvestor ? idea.description : null,
        comments: isMyIdea ? idea.comments : [] // only show comments to owner
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
};


const getIdeaById = async (req, res) => {
  const ideaId = req.params.id;

  try {
    const idea = await Idea.findById(ideaId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'name' // shows name of the commenter
        }
      });

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
    const ideas = await Idea.find({ createdBy: req.params.id });
    res.status(200).json(ideas);
  } catch (err) {
    console.error("Error fetching user ideas:", err);
    res.status(500).json({ message: "Server error" });
  }
};


{/*const getUserIdeas = async (req, res) => {
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
// In ideaController.js


const getViewers = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user._id }).select('_id');
    const ideaIds = ideas.map(i => i._id);

    const viewers = await Viewer.find({ ideaId: { $in: ideaIds } })
      .populate('userId', 'name')
      .populate('ideaId', 'title');

    const formatted = viewers.map(v => ({
      viewerName: v.userId?.name,
      ideaTitle: v.ideaId?.title,
      viewedAt: v.viewedAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error in getViewers:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
// ideaController.js
const updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (String(idea.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(idea, req.body);
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (String(idea.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await idea.remove();
    res.json({ message: 'Idea deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user._id });
    res.status(200).json(ideas);
  } catch (err) {
    console.error("Error fetching my ideas:", err);
    res.status(500).json({ message: "Server error" });
  }
};const Comment = require('../models/Comment');

const addComment = async (req, res) => {
  const { ideaId, content } = req.body;

  const comment = new Comment({
    ideaId,
    userId: req.user._id,
    content
  });

  await comment.save();

  // Optional: Push comment into Idea
  await Idea.findByIdAndUpdate(ideaId, { $push: { comments: comment._id } });

  res.status(201).json(comment);
};

// Get all comments for a specific idea
const getCommentsByIdea = async (req, res) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.ideaId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/ideaController.js





const getMyIdeasWithInvestors = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Find all ideas created by the logged-in user (innovator)
    const myIdeas = await Idea.find({ createdBy: userId });

    // Step 2: For each idea, find its viewers who are investors
    const ideasWithViewers = await Promise.all(
      myIdeas.map(async (idea) => {
        const viewers = await Viewer.find({ ideaId: idea._id })
          .populate({
            path: "userId",
            match: { role: "investor" },
            select: "name email", // adjust what you want to show
          })
          .lean();

        const investors = viewers.map((v) => v.userId).filter(Boolean); // filter out nulls (non-investors)

        return {
          ...idea.toObject(),
          viewedByInvestors: investors,
        };
      })
    );

    res.json(ideasWithViewers);
  } catch (error) {
    console.error("Error fetching ideas with investors:", error);
    res.status(500).json({ error: "Server error" });
  }
};




// GET /ideas/:id/viewers
const getIdeaViewers = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('viewers', 'name email');
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    res.json(idea.viewers);
  } catch (error) {
    console.error('Error fetching viewers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createIdea,
  getAllSummaries, getMyIdeasWithInvestors,getIdeaViewers,
  getIdeaById,
  getUserIdeas,
  getViewers,
  getMyIdeas,deleteIdea,updateIdea,addComment,getCommentsByIdea
};
*/}
{/*const Idea = require('../models/idea');
const Viewer = require('../models/viewermodel');
const Comment = require('../models/Comment');

// ✅ Create a new idea
exports.createIdea = async (req, res) => {
  try {
    const idea = new Idea({ ...req.body, createdBy: req.user.id });
    await idea.save();
    res.status(201).json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get summaries of all ideas (for summary listing)
exports.getAllSummaries = async (req, res) => {
  try {
    const ideas = await Idea.find({}, 'title summary createdBy');
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get full idea details by ID (investor only, and track viewer)
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('createdBy', 'name email');
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Track viewer only if not already viewed
    const alreadyViewed = await Viewer.findOne({
      ideaId: idea._id,
      investorId: req.user.id,
    });

    if (!alreadyViewed && req.user.role === 'investor') {
      await Viewer.create({
        ideaId: idea._id,
        investorId: req.user.id,
      });
    }

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get comments for a specific idea
exports.getCommentsByIdea = async (req, res) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.ideaId }).populate('investorId', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add a comment (investor only)
exports.addComment = async (req, res) => {
  try {
    const { ideaId, text } = req.body;
    const comment = new Comment({
      ideaId,
      investorId: req.user.id,
      text,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get ideas by specific user (used in profile)
exports.getUserIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.params.id });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get logged-in user's ideas with their viewers (innovator dashboard)
exports.getIdeaViewers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all ideas created by current user
    const myIdeas = await Idea.find({ createdBy: userId });

    const result = await Promise.all(myIdeas.map(async (idea) => {
      const viewers = await Viewer.find({ ideaId: idea._id })
        .populate('userId', 'name email')     // populate innovator viewers
        .populate('investorId', 'name email') // populate investor viewers
        .exec();

      return {
        idea,
        viewers
      };
    }));

    res.json(result);
  } catch (err) {
    console.error('Error in getMyIdeaViewers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// ✅ Get viewers of one idea
exports.getMyIdeasWithInvestors = async (req, res) => {
  try {
    const viewers = await Viewer.find({ ideaId: req.params.id }).populate('investorId', 'name email');
    res.status(200).json(viewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: update / delete idea
exports.updateIdea = async (req, res) => {
  try {
    const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/}const bcrypt = require('bcrypt');
const Idea = require('../models/idea');
const Viewer = require('../models/viewermodel');
//const Comment = require('../models/Comment');
const User = require('../models/user'); // Assuming you have this model

const SALT_ROUNDS = 10;

// ✅ Create a new idea (Only non-investors)
exports.createIdea = async (req, res) => {
  try {
    if (req.user.role === 'investor') {
      return res.status(403).json({ message: 'Investors cannot create ideas' });
    }

    const idea = new Idea({ ...req.body, createdBy: req.user.id });
    await idea.save();
    res.status(201).json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update idea (Only non-investors)
exports.updateIdea = async (req, res) => {
  try {
    if (req.user.role === 'investor') {
      return res.status(403).json({ message: 'Investors cannot update ideas' });
    }

    const idea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete idea (Only non-investors)
exports.deleteIdea = async (req, res) => {
  try {
    if (req.user.role === 'investor') {
      return res.status(403).json({ message: 'Investors cannot delete ideas' });
    }

    await Idea.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Save hashed NTN number (after admin verifies)
exports.saveVerifiedNTN = async (req, res) => {
  try {
    const { userId, ntn } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'investor') {
      return res.status(404).json({ message: 'Investor not found' });
    }

    const HashedNtn = await bcrypt.hash(ntn, SALT_ROUNDS);
    user.verified = true;
    user.HashedNtn = ntn
    await user.save();

    res.status(200).json({ message: 'NTN verified and saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all summaries (general listing)
exports.getAllSummaries = async (req, res) => {
  try {
  const ideas = await Idea.find({}, 'title summary description investorNeeded developersNeeded createdBy comments')
  .populate('comments.userId', 'name email');

    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get full idea details (creator or investor only)
exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).populate('createdBy', 'name email').populate('comments.userId', 'name email');;
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    const isOwner = idea.createdBy._id.toString() === req.user.id;
    const isInvestor = req.user.role === 'investor';

    if (!isOwner && !isInvestor) {
      return res.status(403).json({ message: 'Access denied to full description' });
    }

    if (isInvestor) {
      const alreadyViewed = await Viewer.findOne({ ideaId: idea._id, investorId: req.user.id });
      if (!alreadyViewed) {
        await Viewer.create({ ideaId: idea._id, investorId: req.user.id });
      }
    }

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get ideas of a specific user
exports.getUserIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ createdBy: req.params.id });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get comments on idea
exports.getCommentsByIdea = async (req, res) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.ideaId }).populate('investorId', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add comment (only investor)
// POST /api/ideas/comment
exports.addComment = async (req, res) => {
  try {
    const { ideaId, content } = req.body;
    const userId = req.user._id;

    const idea = await Idea.findById(ideaId);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    idea.comments.push({ userId, content });
    await idea.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get current user’s ideas and viewers
exports.getIdeaViewers = async (req, res) => {
  try {
    const userId = req.user.id;
    const myIdeas = await Idea.find({ createdBy: userId });

    const result = await Promise.all(myIdeas.map(async (idea) => {
      const viewers = await Viewer.find({ ideaId: idea._id })
        .populate('userId', 'name email')
        .populate('investorId', 'name email')
        .exec();

      return { idea, viewers };
    }));

    res.json(result);
  } catch (err) {
    console.error('Error in getIdeaViewers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get viewers of one idea
exports.getMyIdeasWithInvestors = async (req, res) => {
  try {
    const viewers = await Viewer.find({ ideaId: req.params.id }).populate('investorId', 'name email');
    res.status(200).json(viewers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

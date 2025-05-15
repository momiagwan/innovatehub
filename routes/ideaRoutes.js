{/*const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createIdea, getAllSummaries, getIdeaById, getUserIdeas, getViewers } = require('../controllers/ideaController');
const { addComment } = require('../controllers/commentController');

router.post('/create', auth, createIdea);
router.get('/summaries', auth, getAllSummaries);

router.post('/comment', auth, addComment);
router.get('/my', auth, getUserIdeas); 
router.get('/viewers', auth, getViewers);
router.get('/:id', auth, getIdeaById);
router.put('/:id', auth, async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(idea, req.body);
    await idea.save();
    res.json(idea);
});

router.delete('/:id', auth, async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    if (idea.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await idea.remove();
    res.json({ message: 'Idea deleted' });
});
router.get('/:id', auth, getIdeaById);
router.get("/:id", auth, async (req, res) => {
  try {
    const idea = await Idea.findById
(req.params.id) 
    if (!idea.views.includes(req.user.id)) {
      idea.getViewers.push(req.user.id);
      await idea.save();
    }
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;*/}








{/*const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createIdea, getAllSummaries, getIdeaById, getUserIdeas,updateIdea,getIdeaViewers,deleteIdea,addComment,getCommentsByIdea } = require('../controllers/ideaController');
//const { addComment } = require('../controllers/commentController');
const Viewer = require('../models/viewermodel');
const Idea = require('../models/Idea');

const { getMyIdeasWithInvestors } = require("../controllers/ideaController");
// Create new idea
router.post('/create', auth, createIdea);

// Get summaries for all ideas (public view)
router.get('/summaries', auth, getAllSummaries);
// Get ideas for a specific user (used in dashboard)
router.get('/user/:id', auth, getUserIdeas);



router.get('/:id/viewers',auth, getMyIdeasWithInvestors);
router.get('/:id/viewers', auth, getIdeaViewers);


// Get full idea by ID
router.get("/:id", auth, getIdeaById)
  


router.put('/:id', auth, updateIdea);
router.delete('/:id', auth, deleteIdea);
router.post('/comment', auth, addComment);
// Get all comments for a specific idea
router.get('/comment/:ideaId', auth, getCommentsByIdea);




module.exports = router;

*/}
const express = require('express');
const router = express.Router();
const {
  createIdea,
  getAllSummaries,
  getIdeaById,
  getUserIdeas,
  getCommentsByIdea,
  addComment,
  getMyIdeasWithInvestors,
  getIdeaViewers,
  updateIdea,
  deleteIdea
} = require('../controllers/ideaController');
const auth = require('../middleware/authMiddleware');

// Routes
router.post('/create', auth, createIdea);
router.get('/summaries', auth, getAllSummaries);
router.get('/my-investors', auth, getMyIdeasWithInvestors);
router.get('/:id', auth, getIdeaById);
router.get('/user/:id', auth, getUserIdeas);
router.post('/comment', auth, addComment);
router.get('/comment/:ideaId', auth, getCommentsByIdea);


router.get('/:id/viewers', auth, getIdeaViewers);
router.put('/:id', auth, updateIdea);
router.delete('/:id', auth, deleteIdea);

module.exports = router;

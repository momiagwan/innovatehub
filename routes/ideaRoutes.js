const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createIdea, getAllSummaries, getIdeaById, getUserIdeas, getViewers } = require('../controllers/ideaController');
const { addComment } = require('../controllers/commentController');

router.post('/create', auth, createIdea);
router.get('/summaries', auth, getAllSummaries);
router.get('/:id', auth, getIdeaById);
router.post('/comment', auth, addComment);
{/*router.get('/my', auth, getUserIdeas); */}
router.get('/viewers', auth, getViewers);
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

module.exports = router;

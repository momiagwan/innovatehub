const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const { content, ideaId } = req.body;
  const comment = new Comment({ content, createdBy: req.user.id, idea: ideaId });
  await comment.save();
  res.status(201).json(comment);
};
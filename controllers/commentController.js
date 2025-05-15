const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const { content, ideaId } = req.body;
  const comment = new Comment({ content, createdBy: req.user.id, idea: ideaId ,userId:req.user._id});
  await comment.save();
  res.status(201).json(comment);
};
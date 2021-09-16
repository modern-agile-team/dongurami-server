'use strict';

const Comment = require('../../models/services/Board/Comment/Comment');

const process = {
  createCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.createCommentNum();

    if (response.success) return res.status(201).json(response);
    return res.status(500).json(response.clientMsg);
  },

  updateByCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.updateByCommentNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },

  deleteAllByGroupNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.deleteAllByGroupNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(500).json(response.clientMsg);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

'use strict';

const Comment = require('../../models/services/Board/Comment/Comment');
const logger = require('../../config/logger');

const process = {
  createCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.createCommentNum();
    const { category } = req.params;
    const { boardNum } = req.params;

    if (response.success) {
      logger.info(
        `POST /api/board/${category}/${boardNum} 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/board/${category}/${boardNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `POST /api/board/${category}/${boardNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  createReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.createReplyCommentNum();
    const { category } = req.params;
    const { boardNum } = req.params;
    const { cmtNum } = req.params;

    if (response.success) {
      logger.info(
        `POST /api/board/${category}/${boardNum}/${cmtNum} 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/board/${category}/${boardNum}/${cmtNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `POST /api/board/${category}/${boardNum}/${cmtNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  updateByCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.updateByCommentNum();
    const { category } = req.params;
    const { boardNum } = req.params;
    const { cmtNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/board/${category}/${boardNum}/${cmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/board/${category}/${boardNum}/${cmtNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/board/${category}/${boardNum}/${cmtNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  updateByReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.updateByReplyCommentNum();
    const { category } = req.params;
    const { boardNum } = req.params;
    const { cmtNum } = req.params;
    const { replyCmtNum } = req.params;

    if (response.success) {
      logger.info(
        `PUT /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  deleteAllByGroupNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.deleteAllByGroupNum();
    const { category } = req.params;
    const { boardNum } = req.params;
    const { cmtNum } = req.params;

    if (response.success) {
      logger.info(
        `DELETE /api/board/${category}/${boardNum}/${cmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/board/${category}/${boardNum}/${cmtNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `DELETE /api/board/${category}/${boardNum}/${cmtNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },

  deleteOneReplyCommentNum: async (req, res) => {
    const comment = new Comment(req);
    const response = await comment.deleteOneReplyCommentNum();
    const { category } = req.params;
    const { boardNum } = req.params;
    const { cmtNum } = req.params;
    const { replyCmtNum } = req.params;

    if (response.success) {
      logger.info(
        `DELETE /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `DELETE /api/board/${category}/${boardNum}/${cmtNum}/${replyCmtNum} 404: ${response.msg}`
    );
    return res.status(404).json(response);
  },
};

module.exports = {
  process,
};

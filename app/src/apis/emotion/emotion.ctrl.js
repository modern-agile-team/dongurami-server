'use strict';

const Emotion = require('../../models/services/Emotion/Emotion');
const logger = require('../../config/logger');

const process = {
  likedByBoardNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByBoardNum();
    const { boardNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/liked/board/${boardNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/liked/board/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/liked/board/${boardNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/liked/board/${boardNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/liked/board/${boardNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  unLikedByBoardNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByBoardNum();
    const { boardNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/unliked/board/${boardNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/unliked/board/${boardNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/unliked/board/${boardNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/unliked/board/${boardNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/unliked/board/${boardNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  likedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByCmtNum();
    const { cmtNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/liked/comment/${cmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/liked/comment/${cmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/liked/comment/${cmtNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/liked/comment/${cmtNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/liked/comment/${cmtNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  unLikedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByCmtNum();
    const { cmtNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/unliked/comment/${cmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/unliked/comment/${cmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/unliked/comment/${cmtNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/unliked/comment/${cmtNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/unliked/comment/${cmtNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  likedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByReplyCmtNum();
    const { replyCmtNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/liked/reply-comment/${replyCmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/liked/reply-comment/${replyCmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/liked/reply-comment/${replyCmtNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/liked/reply-comment/${replyCmtNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/liked/reply-comment/${replyCmtNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  unLikedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByReplyCmtNum();
    const { replyCmtNum } = req.params;

    if (response.success) {
      logger.info(
        `patch /api/emotion/unliked/reply-comment/${replyCmtNum} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `patch /api/emotion/unliked/reply-comment/${replyCmtNum} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    if (response.status === 404) {
      logger.error(
        `patch /api/emotion/unliked/reply-comment/${replyCmtNum} 404: ${response.msg}`
      );
      return res.status(404).json(response);
    }
    if (response.status === 409) {
      logger.error(
        `patch /api/emotion/unliked/reply-comment/${replyCmtNum} 409: ${response.msg}`
      );
      return res.status(409).json(response);
    }
    logger.error(
      `patch /api/emotion/unliked/reply-comment/${replyCmtNum} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = { process };

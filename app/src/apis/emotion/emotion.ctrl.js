'use strict';

const Emotion = require('../../models/services/Emotion/Emotion');
const logger = require('../../config/logger');

function processCtrl(res, apiInfo) {
  function createLogger() {
    function createLoggerMsg() {
      if (apiInfo.response.status === 500) {
        return `${apiInfo.method} /api/${apiInfo.url}/${apiInfo.params} ${apiInfo.response.status}: \n${apiInfo.response.errMsg.stack}`;
      }
      return `${apiInfo.method} /api/${apiInfo.url}/${apiInfo.params} ${apiInfo.response.status}: ${apiInfo.response.msg}`;
    }

    if (apiInfo.response.status === 200) {
      return logger.info(createLoggerMsg());
    }
    return logger.error(createLoggerMsg());
  }

  function responseToClientByRequest() {
    if (apiInfo.response.status === 500) {
      return res
        .status(apiInfo.response.status)
        .json(apiInfo.response.clientMsg);
    }
    return res.status(apiInfo.response.status).json(apiInfo.response);
  }

  createLogger();
  return responseToClientByRequest();
}

const process = {
  likedByBoardNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByBoardNum();
    const apiInfo = {
      response,
      params: req.params.boardNum,
      method: 'PATCH',
      path: 'emotion/liked/board',
    };

    return processCtrl(res, apiInfo);
  },

  unLikedByBoardNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByBoardNum();
    const apiInfo = {
      response,
      params: req.params.boardNum,
      method: 'PATCH',
      path: 'emotion/unliked/board',
    };

    return processCtrl(res, apiInfo);
  },

  likedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByCmtNum();
    const apiInfo = {
      response,
      params: req.params.cmtNum,
      method: 'PATCH',
      path: 'emotion/liked/comment',
    };

    return processCtrl(res, apiInfo);
  },

  unLikedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByCmtNum();
    const apiInfo = {
      response,
      params: req.params.cmtNum,
      method: 'PATCH',
      path: 'emotion/unliked/comment',
    };

    return processCtrl(res, apiInfo);
  },

  likedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByReplyCmtNum();
    const apiInfo = {
      response,
      params: req.params.replyCmtNum,
      method: 'PATCH',
      path: 'emotion/liked/reply-comment',
    };

    return processCtrl(res, apiInfo);
  },

  unLikedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByReplyCmtNum();
    const apiInfo = {
      response,
      params: req.params.replyCmtNum,
      method: 'PATCH',
      path: 'emotion/unliked/reply-comment',
    };

    return processCtrl(res, apiInfo);
  },
};

module.exports = { process };

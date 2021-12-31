'use strict';

const Emotion = require('../../models/services/Emotion/Emotion');
const logger = require('../../config/logger');

function processCtrl(res, apiInfo) {
  function createLoggerMsg() {
    if (apiInfo.response.status === undefined) {
      return `${apiInfo.method} ${apiInfo.path} 500: \n${apiInfo.response.errMsg.stack}`;
    }
    return `${apiInfo.method} ${apiInfo.path} ${apiInfo.response.status}: ${apiInfo.response.msg}`;
  }

  function createLogger() {
    if (apiInfo.response.status < 400) {
      return logger.info(createLoggerMsg());
    }
    return logger.error(createLoggerMsg());
  }

  function responseToClientByRequest(response) {
    if (response.status === undefined) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(response.status).json(response);
  }

  createLogger();
  return responseToClientByRequest(apiInfo.response);
}

function getApiInfo(method, response, req) {
  return {
    method,
    response,
    path: req.originalUrl,
  };
}

const process = {
  likedByBoardNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByBoardNum();
    const apiInfo = getApiInfo('PUT', response, req);

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

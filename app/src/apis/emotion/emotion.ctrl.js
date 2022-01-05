'use strict';

const Emotion = require('../../models/services/Emotion/Emotion');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');

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
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  likedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByCmtNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  unLikedByCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByCmtNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  likedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.likedByReplyCmtNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  unLikedByReplyCmtNum: async (req, res) => {
    const emotion = new Emotion(req);
    const response = await emotion.unLikedByReplyCmtNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = { process };

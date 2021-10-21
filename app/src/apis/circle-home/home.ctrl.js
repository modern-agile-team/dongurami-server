'use strict';

const Home = require('../../models/services/CircleHome/Home');
const logger = require('../../config/logger');

const process = {
  findOneByClubNum: async (req, res) => {
    const home = new Home(req);
    const response = await home.findOneByClubNum();

    if (response.success) {
      logger.info(`GET /api/club/home/clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/club/home/clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/home/clubNum 404: ${response.msg}`);
    return res.status(404).json(response); // 존재하는 동아리가 없을 시 -> 파라미터를 건들여 접속한 경우
  },

  updateClubInfo: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubInfo();

    if (response.success) {
      logger.info(`PATCH /api/club/home/clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PATCH /api/club/home/clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PATCH /api/club/home/clubNum 403: ${response.msg}`);
    return res.status(403).json(response);
  },

  updateClubLogo: async (req, res) => {
    const home = new Home(req);
    const response = await home.updateClubLogo();

    if (response.success) {
      logger.info(`PUT /api/club/home/clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PUT /api/club/home/clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PUT /api/club/home/clubNum 403: ${response.msg}`);
    return res.status(403).json(response);
  },
};

module.exports = {
  process,
};

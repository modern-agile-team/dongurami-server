'use strict';

const ClubStorage = require('../../models/services/Club/ClubStorage');
const logger = require('../../config/logger');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubStorage.readClubList();

    if (response.isError) {
      logger.error(`GET /api/club/list 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`GET /api/club/list 200: ${response.msg}`);
    return res.status(200).json(response);
  },
};

module.exports = {
  process,
};

'use strict';

const ClubStorage = require('../../models/services/Club/ClubStorage');
const logger = require('../../config/logger');

const process = {
  readClubList: async (req, res) => {
    const response = await ClubStorage.readClubList();

    if (response.success) {
      logger.info(`GET /api/club/list 200 : ${response.msg}`);
      return res.status(200).json(response);
    }
    return res
      .status(500)
      .json({ success: false, msg: '개발자에게 문의해주세요.' });
  },
};

module.exports = {
  process,
};

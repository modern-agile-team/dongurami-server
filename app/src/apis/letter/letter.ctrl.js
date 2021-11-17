'use strict';

const Letter = require('../../models/services/Letter/Letter');
const logger = require('../../config/logger');

const process = {
  createLetter: async (req, res) => {
    const letter = new Letter();
    const response = await letter.createLetter();

    if (resonse.success) {
      logger.info(`GET /api/letter/send 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/letter/send 500: \n${response.clientMsg.stack}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/letter/send 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};
module.exports = {
  process,
};

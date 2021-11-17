'use strict';

const Letter = require('../../models/services/Letter/Letter');
const logger = require('../../config/logger');

const process = {
  findLetters: async (req, res) => {
    const letter = new Letter();
    const { id } = req.auth;
    const response = await letter.findLetters();

    if (response.success) {
      logger.info(`GET /api/letter/${id} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/letter/${id} 500: \n${response.clientMsg.stack}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/letter/${id} 403: ${response.msg}`);
    return res.status(403).json(response);
  },

  createLetter: async (req, res) => {
    const letter = new Letter();
    const response = await letter.createLetter();

    if (resonse.success) {
      logger.info(`POST /api/letter/send 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/letter/send 500: \n${response.clientMsg.stack}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/letter/send 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};
module.exports = {
  process,
};

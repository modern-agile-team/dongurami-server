'use strict';

const Letter = require('../../models/services/Letter/Letter');
const logger = require('../../config/logger');

const process = {
  findLetters: async (req, res) => {
    const letter = new Letter(req);
    const { id } = req.params;
    const response = await letter.findLetters();

    if (response.success) {
      logger.info(`GET /api/letter/${id} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/letter/${id} 500: \n${response.errMsg.stack}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/letter/${id} 403: ${response.msg}`);
    return res.status(403).json(response);
  },

  findLettersByGroup: async (req, res) => {
    const letter = new Letter(req);
    const { id } = req.params;
    const { letterNo } = req.params;
    const response = await letter.findLettersByGroup();

    if (response.success) {
      logger.info(`GET /api/letter/${id}/${letterNo} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/letter/${id}/${letterNo} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    if (response.status === 403) {
      logger.error(`GET /api/letter/${id}/${letterNo} 403: ${response.msg}`);
      return res.status(403).json(response);
    }
    logger.error(`GET /api/letter/${id}/${letterNo} 404: ${response.msg}`);
    return res.status(404).json(response);
  },

  createLetter: async (req, res) => {
    const letter = new Letter(req);
    const response = await letter.createLetter();

    if (response.success) {
      logger.info(`POST /api/letter/send 200: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/letter/send 500: \n${response.errMsg.stack}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/letter/send 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  createReplyLetter: async (req, res) => {
    const letter = new Letter(req);
    const { id } = req.params;
    const { letterNo } = req.params;
    const response = await letter.createReplyLetter();

    if (response.success) {
      logger.info(`POST /api/letter/${id}/${letterNo} 200: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/letter/${id}/${letterNo} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/letter/${id}/${letterNo} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  deleteLetters: async (req, res) => {
    const letter = new Letter(req);
    const { id } = req.params;
    const { letterNo } = req.params;
    const response = await letter.deleteLetters();

    if (response.success) {
      logger.info(`DELETE /api/letter/${id}/${letterNo} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/letter/${id}/${letterNo} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`DELETE /api/letter/${id}/${letterNo} 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};
module.exports = {
  process,
};

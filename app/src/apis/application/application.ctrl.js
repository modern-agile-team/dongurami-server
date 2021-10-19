'use strict';

const Application = require('../../models/services/Application/Application');
const logger = require('../../config/logger');

const process = {
  findAllByClubNum: async (req, res) => {
    const application = new Application(req);
    const response = await application.findAllByClubNum();

    if (response.success) {
      logger.info(`GET /clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /clubNum 404: ${response.msg}`);
    return res.status(404).json(response); // 동아리가 존재 하지 않을 시
  },

  createQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.createQuestion();

    if (response.success) {
      logger.info(`POST /clubNum 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();

    if (response.success) {
      logger.info(`PUT /clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PUT /clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PUT /clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();

    if (response.success) {
      logger.info(`DELETE /clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`DELETE /clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`DELETE /clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  createAnswer: async (req, res) => {
    const application = new Application(req);
    const response = await application.createAnswer();

    if (response.success) {
      logger.info(`POST /clubNum 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /clubNum 500: \n${response.errMsg}`);
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

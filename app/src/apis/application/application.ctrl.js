'use strict';

const Application = require('../../models/services/Application/Application');
const logger = require('../../config/logger');

const process = {
  findAllByClubNum: async (req, res) => {
    const application = new Application(req);
    const response = await application.findAllByClubNum();

    if (response.success) {
      logger.info(`GET /api/club/application/clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/club/application/clubNum 500: \n${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`GET /api/club/application/clubNum 404: ${response.msg}`);
    return res.status(404).json(response); // 동아리가 존재 하지 않을 시
  },

  createQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.createQuestion();

    if (response.success) {
      logger.info(`POST /api/club/application/clubNum 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/application/clubNum 500: \n${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`POST /api/club/application/clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();

    if (response.success) {
      logger.info(`PUT /api/club/application/clubNum/no 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/application/clubNum/no 500: \n${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(`PUT /api/club/application/clubNum/no 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();

    if (response.success) {
      logger.info(
        `DELETE /api/club/application/clubNum/no 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/club/application/clubNum/no 500: \n${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `DELETE /api/club/application/clubNum/no 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  createAnswer: async (req, res) => {
    const application = new Application(req);
    const response = await application.createAnswer();

    if (response.success) {
      logger.info(
        `POST /api/club/application/clubNum/answer 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/application/clubNum/answer 500: \n${response.errMsg}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `POST /api/club/application/clubNum/answer 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

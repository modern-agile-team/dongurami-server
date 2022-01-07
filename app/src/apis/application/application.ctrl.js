'use strict';

const Application = require('../../models/services/Application/Application');
const logger = require('../../config/logger');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  findAllByClubNum: async (req, res) => {
    const application = new Application(req);
    const response = await application.findAllByClubNum();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  createQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.createQuestion();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },

  createAnswer: async (req, res) => {
    const application = new Application(req);
    const { clubNum } = req.params;
    const response = await application.createAnswer();

    if (response.success) {
      logger.info(
        `POST /api/club/application/${clubNum}/answer 201: ${response.msg}`
      );
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/application/${clubNum}/answer 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    logger.error(
      `POST /api/club/application/${clubNum}/answer 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

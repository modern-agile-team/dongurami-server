'use strict';

const Application = require('../../models/services/Application/Application');
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
    const response = await application.createAnswer();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};

'use strict';

const AdminOption = require('../../models/services/AdminOption/AdminOption');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');
const logger = require('../../config/logger');

const process = {
  checkClubAdmin: async (req, res, next) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkClubAdmin();
    const apiInfo = getApiInfo('GET', response, req);

    const result = processCtrl(res, apiInfo, 1);

    if (result) return next();
    return result;
  },

  checkLeaderAdmin: async (req, res, next) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.checkLeaderAdmin();
    const apiInfo = getApiInfo('POST', response, req);

    const result = processCtrl(res, apiInfo, 1);

    if (result) return next();
    return result;
  },

  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const url = req.originalUrl;
    const response = {};
    response.memberInfo = await adminOption.findOneByClubNum();

    if (response.memberInfo.isError) {
      logger.error(`GET ${url} 500: \n${response.memberInfo.errMsg.stack}`);
      return res.status(500).json(response.memberInfo.clientMsg);
    }
    response.applicants = await adminOption.findApplicantsByClubNum();

    if (response.applicants.isError) {
      logger.error(`GET ${url} 500: \n${response.applicants.errMsg.stack}`);
      return res.status(500).json(response.applicants.clientMsg);
    }
    if (!response.applicants.success) {
      logger.error(`GET ${url} 400: ${response.applicants.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`GET ${url} 200: ${response.memberInfo.msg}`);
    return res.status(200).json(response);
  },

  createMemberById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.createMemberById();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateLeaderById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateLeaderById();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  updateAdminOptionById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateAdminOptionById();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  updateRejectedApplicantById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateRejectedApplicantById();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteMemberById: async (req, res) => {
    const adminOption = new AdminOption(req);
    const response = await adminOption.deleteMemberById();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};

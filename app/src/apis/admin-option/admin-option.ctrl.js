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

  findOneByClubNum: async (req, res) => {
    const adminOption = new AdminOption(req);
    const url = req.originalUrl;
    const response = {};

    response.memberInfo = await adminOption.findOneByClubNum();

    if (response.memberInfo.isError) {
      logger.error(`GET ${url} 500: \n${response.memberInfo.errMsg.stack}`);
      return res.status(500).json(response.memberInfo.clientMsg);
    }
    if (!response.memberInfo.success) {
      logger.error(`GET ${url} 400: ${response.memberInfo.msg}`);
      return res.status(400).json(response);
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
    const url = req.originalUrl;
    const adminOption = new AdminOption(req);
    const response = await adminOption.createMemberById();

    if (response.isError) {
      logger.error(`POST ${url} 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    if (!response.success) {
      logger.error(`POST ${url} 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`POST ${url} 201: ${response.msg}`);
    return res.status(201).json(response);
  },

  updateLeaderById: async (req, res) => {
    const url = req.originalUrl;
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateLeaderById();

    if (response.isError) {
      logger.error(`PUT ${url} 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    if (!response.success) {
      logger.error(`PUT ${url} 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`PUT ${url} 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  updateAdminOptionById: async (req, res) => {
    const url = req.originalUrl;
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateAdminOptionById();

    if (response.isError) {
      logger.error(`PUT ${url} 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    if (!response.success) {
      logger.error(`PUT /${url} 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`PUT ${url} 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  updateRejectedApplicantById: async (req, res) => {
    const url = req.originalUrl;
    const adminOption = new AdminOption(req);
    const response = await adminOption.updateRejectedApplicantById();

    if (response.isError) {
      logger.error(`PUT ${url} 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    if (!response.success) {
      logger.error(`PUT ${url} 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`PUT ${url} 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  deleteMemberById: async (req, res) => {
    const url = req.originalUrl;
    const adminOption = new AdminOption(req);
    const response = await adminOption.deleteMemberById();

    if (response.isError) {
      logger.error(`DELETE ${url} 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    if (!response.success) {
      logger.error(`DELETE ${url} 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    logger.info(`DELETE ${url} 200: ${response.msg}`);
    return res.status(200).json(response);
  },
};

module.exports = {
  process,
};

'use strict';

const Student = require('../../models/services/Student/Student');
const Email = require('../../models/services/Email/Email');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');
const logger = require('../../config/logger');

const process = {
  login: async (req, res) => {
    const student = new Student(req);
    const response = await student.login();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  signUp: async (req, res) => {
    const student = new Student(req);
    const response = await student.signUp();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  findId: async (req, res) => {
    const student = new Student(req);
    const response = await student.findId();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  // 비밀번호 변경
  resetPassword: async (req, res) => {
    const student = new Student(req);
    const response = await student.resetPassword();

    if (response.success) {
      logger.info(`PATCH /api/reset-password 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PATCH /api/reset-password 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`PATCH /api/reset-password 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  sendEmailForFindPassword: async (req, res) => {
    const email = new Email(req);
    const response = await email.sendEmailForFindPassword();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  findPassword: async (req, res) => {
    const student = new Student(req);
    const response = await student.findPassword();
    const apiInfo = getApiInfo('PATCH', response, req);

    return processCtrl(res, apiInfo);
  },

  getUserInfoByJWT: async (req, res) => {
    const student = new Student(req);
    const response = await student.getUserInfoByJWT();

    if (response.success) {
      logger.info(`GET /api/student 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/student 500: \n${response.errMsg.stack}`);
      return res.status(500).json(response);
    }
    logger.error(`GET /api/student 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

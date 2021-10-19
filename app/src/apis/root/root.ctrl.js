'use strict';

const Student = require('../../models/services/Student/Student');
const Email = require('../../models/services/Email/Email');
const Oauth = require('../../models/services/Oauth/Oauth');
const logger = require('../../config/logger');

const process = {
  login: async (req, res) => {
    const student = new Student(req);
    const response = await student.login();

    if (response.success) {
      logger.info(`POST /api/login 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/login 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /api/login 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  signUp: async (req, res) => {
    const student = new Student(req);
    const response = await student.signUp();

    if (response.success) {
      logger.info(`POST /api/sign-up 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/sign-up 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /api/sign-up 409: ${response.msg}`);
    return res.status(409).json(response);
  },

  resUserInfo: (req, res) => {
    const studentInfo = req.auth;

    delete studentInfo.iat;
    delete studentInfo.exp;

    logger.info(`GET /api/login-check 200: 로그인이 된 사용자입니다.`);
    return res.status(200).json({
      success: true,
      msg: '로그인이 된 사용자입니다.',
      studentInfo,
    });
  },

  findId: async (req, res) => {
    const student = new Student(req);
    const response = await student.findId();

    if (response.success) {
      logger.info(`POST /api/find-id 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/find-id 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /api/find-id 400: ${response.msg}`);
    return res.status(400).json(response);
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
      logger.error(`PATCH /api/reset-password 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`PATCH /api/reset-password 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  // 메일 전송
  sendEmailForPassword: async (req, res) => {
    const email = new Email(req);
    const response = await email.sendLinkForPassword();

    if (response.success) {
      logger.info(`POST /api/forgot-password 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /api/forgot-password 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /api/forgot-password 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  // 비밀번호 찾기
  findPassword: async (req, res) => {
    const student = new Student(req);
    const response = await student.findPassword();

    if (response.useable === false) {
      logger.error(`PATCH /api/find-password/token 403: ${response.msg}`);
      return res.status(403).json(response);
    }
    if (!response.success) {
      logger.error(`PATCH /api/find-password/token 400: ${response.msg}`);
      return res.status(400).json(response);
    }
    if (response.isError) {
      logger.error(`PATCH /api/find-password/token 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.info(`PATCH /api/find-password/token 200: ${response.msg}`);
    return res.status(200).json(response);
  },

  // naver OAuth 본인인증 (id, email 받기)
  naverLogin: async (req, res) => {
    const oauth = new Oauth(req);
    try {
      const response = await oauth.naverLogin();

      logger.info(
        `GET /api/naver-login 200: Authentication succeed (인증 성공하였습니다.)`
      );
      return res.status(200).json(response);
    } catch (err) {
      logger.error(`GET /api/naver-login 401: ${err.message}`);
      return res.status(401).json(err);
    }
  },

  getUserInfoByJWT: async (req, res) => {
    const student = new Student(req);
    const response = await student.getUserInfoByJWT();

    if (response.success) {
      logger.info(`GET /api/student 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    logger.error(`GET /api/student 500: ${response.msg}`);
    return res.status(500).json(response);
  },
};

module.exports = {
  process,
};

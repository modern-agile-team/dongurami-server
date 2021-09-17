'use strict';

const Student = require('../../models/services/Student/Student');
const Email = require('../../models/services/Email/Email');

const process = {
  login: async (req, res) => {
    const student = new Student(req);
    const response = await student.login();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  signUp: async (req, res) => {
    const student = new Student(req);
    const response = await student.signUp();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(409).json(response);
  },

  resUserInfo: (req, res) => {
    const studentInfo = req.auth;

    delete studentInfo.iat;
    delete studentInfo.exp;

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
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  // 비밀번호 변경
  resetPassword: async (req, res) => {
    const student = new Student(req);
    const response = await student.resetPassword();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },

  // 메일 전송
  sendEmailForPassword: async (req, res) => {
    const email = new Email(req);
    const response = await email.sendLinkForPassword();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

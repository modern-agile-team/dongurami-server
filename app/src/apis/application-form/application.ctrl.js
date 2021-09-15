'use strict';

const Application = require('../../models/services/ApplicationForm/Application');

const process = {
  findAllByClubNum: async (req, res) => {
    const application = new Application(req);
    const response = await application.findAllByClubNum();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(404).json(response); // 동아리가 존재 하지 않을 시
  },

  createQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.createQuestion();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '서버 개발자에게 문의해주세요.' });
  },
};

module.exports = {
  process,
};

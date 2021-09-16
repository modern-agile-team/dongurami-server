'use strict';

const Application = require('../../models/services/Application/Application');

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

    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(201).json(response);
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();

    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(200).json(response);
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();

    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res.status(200).json(response);
  },

  createAnswer: async (req, res) => {
    const application = new Application(req);
    const response = await application.createAnswer();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '가입 신청서 작성에 실패하셨습니다.' }); // 캐치 에러 x DB등록 X
  },
};

module.exports = {
  process,
};

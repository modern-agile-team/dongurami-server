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
    return res
      .status(404)
      .json({ success: false, msg: '존재하지 않는 동아리입니다.' }); // 동아리가 존재 하지 않을 시
  },

  createQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.createQuestion();

    if (response.success) {
      return res
        .status(201)
        .json({ success: true, msg: '질문 등록에 성공하셨습니다.' });
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '질문 등록에 실패하셨습니다.' });
  },

  updateQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.updateQuestion();

    if (response.success) {
      return res
        .status(200)
        .json({ success, msg: '질문 수정에 성공하셨습니다.' });
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '질문 수정에 실패하셨습니다.' });
  },

  deleteQuestion: async (req, res) => {
    const application = new Application(req);
    const response = await application.deleteQuestion();

    if (response.success) {
      return res
        .status(200)
        .json({ success, msg: '질문 삭제에 성공하셨습니다.' });
    }
    if (response.isError) {
      return res.status(500).json({ success: false, msg: response.clientMsg });
    }
    return res
      .status(400)
      .json({ success: false, msg: '질문 삭제에 실패하셨습니다.' });
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
    return res.status(400).json({ response }); // 캐치 에러 x DB등록 X
  },
};

module.exports = {
  process,
};

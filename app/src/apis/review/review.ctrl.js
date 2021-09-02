'use strict';

const Review = require('../../models/services/Review/Review');
const Auth = require('../../models/services/Auth/Auth');

const process = {
  // 테스트 토큰
  // 로그인 시 토큰이 생성될 것임.
  createToken: (req, res) => {
    const jwt = Auth.createToken(req.body);
    if (!jwt) {
      return res
        .status(401)
        .json({ success: false, msg: 'JWT가 존재하지 않습니다.' });
    }
    return res
      .status(201)
      .json({ success: true, msg: 'JWT가 생성되었습니다.', jwt });
  },

  // 후기 작성
  createByReview: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByReivew();
    if (response.success) {
      return res.status(201).json(response);
    }
    return res.status(400).json(response);
  },

  // 모든 후기 리스트를 보여줌.
  findOneByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.findOneByClubNum();
    if (response.success) {
      return res.status(200).json(response);
    }
    return res.status(400).json(response);
  },

  // 등록된 후기 글 수정.
  updateById: async (req, res) => {
    const review = new Review(req);
    const response = await review.updateById();
    if (response.success) {
      return res.status(201).json(response);
    }
    return res.status(400).json(response);
  },

  // 등록된 후기 글 삭제.
  deleteByNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.deleteByNum();
    if (response.success) {
      return res.status(201).json(response);
    }
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

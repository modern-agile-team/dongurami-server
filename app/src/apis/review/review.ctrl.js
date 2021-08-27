'use strict';

const Review = require('../../models/services/Review/Review');
const ReviewStorage = require('../../models/services/Review/ReviewStorage');
const Auth = require('../../models/services/Auth/Auth');

const process = {
  // 테스트 토큰
  createToken: (req, res) => {
    const token = Auth.createToken(req.body);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: 'JWT가 존재하지 않습니다.' });
    }
    return res
      .status(201)
      .json({ success: true, msg: 'JWT가 생성되었습니다.', token });
  },

  // 후기 작성
  createByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByClubNum();
    if (response.success) {
      return res.status(201).json(response);
    }
    return res.status(400).json(response);
  },

  // 모든 후기 리스트
  findAllReview: async (req, res) => {
    const reviewList = await ReviewStorage.findAllReview();
    return res.status(200).json(reviewList);
  },
};

module.exports = {
  process,
};

'use strict';

const Review = require('../../models/services/Review/Review');

const process = {
  // 테스트용 JWT
  createToken: async (req, res) => {
    const jwt = await Auth.createJWT(req.body, req.body.clubNum);

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
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
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
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
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
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
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
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

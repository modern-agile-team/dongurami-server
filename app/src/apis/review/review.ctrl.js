'use strict';

const Review = require('../../models/services/Review/Review');

const process = {
  // 후기 작성
  createByReview: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByReivew();

    if (response.success) return res.status(201).json(response);
    if (response.isError) return res.status(400).json(response);
    return res.status(500).json(response.clinetMsg);
  },

  // 모든 후기 리스트를 보여줌.
  findOneByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.findOneByClubNum();

    if (response.success) return res.status(200).json(response);
    if (response.isError) return res.status(400).json(response);
    return res.status(500).json(response.clientMsg);
  },

  // 등록된 후기 글 수정.
  updateById: async (req, res) => {
    const review = new Review(req);
    const response = await review.updateById();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(400).json(response);
    }
    return res.status(500).json(response.clientMsg);
  },

  // 등록된 후기 글 삭제.
  deleteByNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.deleteByNum();

    if (response.success) {
      return res.status(201).json(response);
    }
    if (response.isError) {
      return res.status(400).json(response);
    }
    return res.status(500).json(response.clientMsg);
  },
};

module.exports = {
  process,
};

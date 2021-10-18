'use strict';

const Review = require('../../models/services/Review/Review');

const process = {
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

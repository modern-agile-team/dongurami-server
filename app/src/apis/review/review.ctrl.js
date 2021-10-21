'use strict';

const Review = require('../../models/services/Review/Review');
const logger = require('../../config/logger');

const process = {
  findOneByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.findOneByClubNum();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(`GET /api/club/review/${clubNum} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /api/club/review/${clubNum} 500: \n${response.errMsg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/club/review/${clubNum} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  createByReview: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByReivew();
    const { clubNum } = req.params;

    if (response.success) {
      logger.info(`POST /api/club/review/${clubNum} 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(
        `POST /api/club/review/${clubNum} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /api/club/review/${clubNum} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateById: async (req, res) => {
    const review = new Review(req);
    const response = await review.updateById();
    const { params } = req;

    if (response.success) {
      logger.info(
        `PUT /api/club/review/${params.clubNum}/${params.num}} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `PUT /api/club/review/${params.clubNum}/${params.num} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `PUT /api/club/review/${params.clubNum}/${params.num} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },

  deleteByNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.deleteByNum();
    const { params } = req;

    if (response.success) {
      logger.info(
        `DELETE /api/club/review/${params.clubNum}/${params.num} 200: ${response.msg}`
      );
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `DELETE /api/club/review/${params.clubNum}/${params.num} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(
      `DELETE /api/club/review/${params.clubNum}/${params.num} 400: ${response.msg}`
    );
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

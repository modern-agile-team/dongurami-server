'use strict';

const Review = require('../../models/services/Review/Review');
const logger = require('../../config/logger');

const process = {
  createByReview: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByReivew();

    if (response.success) {
      logger.info(`POST /clubNum 201: ${response.msg}`);
      return res.status(201).json(response);
    }
    if (response.isError) {
      logger.error(`POST /clubNum 500: \n${response.msg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`POST /clubNum 500: \n${response.msg}`);
    return res.status(400).json(response);
  },

  findOneByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.findOneByClubNum();

    if (response.success) {
      logger.info(`GET /clubNum 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`GET /clubNum 500: \n${response.msg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /clubNum 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  updateById: async (req, res) => {
    const review = new Review(req);
    const response = await review.updateById();

    if (response.success) {
      logger.info(`PUT /clubNum/num 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`PUT /clubNum/num 500: \n${response.msg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`PUT /clubNum/num 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  deleteByNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.deleteByNum();

    if (response.success) {
      logger.info(`DELETE /clubNum/num 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(`DELETE /clubNum/num 500: \n${response.msg}`);
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`DELETE /clubNum/num 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

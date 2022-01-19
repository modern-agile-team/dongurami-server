'use strict';

const Review = require('../../models/services/Review/Review');
const processCtrl = require('../../models/utils/processCtrl');
const getApiInfo = require('../../models/utils/getApiInfo');

const process = {
  findOneByClubNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.findOneByClubNum();

    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  createByReview: async (req, res) => {
    const review = new Review(req);
    const response = await review.createByReviewInfo();

    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  updateById: async (req, res) => {
    const review = new Review(req);
    const response = await review.updateById();

    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteByNum: async (req, res) => {
    const review = new Review(req);
    const response = await review.deleteByNum();

    const apiInfo = getApiInfo('DELELTE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};

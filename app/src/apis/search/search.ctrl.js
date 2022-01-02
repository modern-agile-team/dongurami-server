'use strict';

const Search = require('../../models/services/Search/Search');
const logger = require('../../config/logger');

const process = {
  findAllSearch: async (req, res) => {
    const search = new Search(req);
    const { category } = req.params;
    const response = await search.findAllSearch();

    if (response.success) {
      logger.info(`GET /api/search/${category} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/search/${category} 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/search/${category} 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  findAllPromotionSearch: async (req, res) => {
    const search = new Search(req);
    const response = await search.findAllPromotionSearch();

    if (response.success) {
      logger.info(`GET /api/search/promotion/category 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/search/promotion/category 500: \n${response.errMsg.stack}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/search/promotion/category 400: ${response.msg}`);
    return res.status(400).json(response);
  },

  findAllClubList: async (req, res) => {
    const search = new Search(req);
    const response = await search.findAllClubList();

    if (response.success) {
      logger.info(`GET /api/search/club-list/category 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    logger.error(
      `GET /api/search/club-list/category 500: \n${response.errMsg.stack}`
    );
    return res.status(500).json(response.clientMsg);
  },
};

module.exports = {
  process,
};

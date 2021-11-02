'use strict';

const Board = require('../../models/services/Board/Board');
const Club = require('../../models/services/Club/Club');
const logger = require('../../config/logger');

const process = {
  search: async (req, res) => {
    const board = new Board(req);
    const { category } = req.params;
    const response = await board.search();

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

  promotionSearch: async (req, res) => {
    const board = new Board(req);
    const response = await board.promotionSearch();

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

  clubListSearch: async (req, res) => {
    const club = new Club(req);
    const response = await club.clubListSearch();

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

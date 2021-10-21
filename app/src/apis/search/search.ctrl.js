'use strict';

const Board = require('../../models/services/Board/Board');
const logger = require('../../config/logger');

const process = {
  search: async (req, res) => {
    const board = new Board(req);
    const { params } = req;
    const response = await board.search();

    if (response.success) {
      logger.info(`GET /api/search/${params.category} 200: ${response.msg}`);
      return res.status(200).json(response);
    }
    if (response.isError) {
      logger.error(
        `GET /api/search/${params.category} 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/search/${params.category} 400: ${response.msg}`);
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
        `GET /api/search/promotion/category 500: \n${response.errMsg}`
      );
      return res.status(500).json(response.clientMsg);
    }
    logger.error(`GET /api/search/promotion/category 400: ${response.msg}`);
    return res.status(400).json(response);
  },
};

module.exports = {
  process,
};

'use strict';

const Board = require('../../models/services/Board/Board');
const getApiInfo = require('../../models/utils/getApiInfo');
const processCtrl = require('../../models/utils/processCtrl');

const process = {
  createBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.createBoardNum();
    const apiInfo = getApiInfo('POST', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllByCategoryNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.findAllByCategoryNum();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findAllByPromotionCategory: async (req, res) => {
    const board = new Board(req);
    const response = await board.findAllByPromotionCategory();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  findOneByBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.findOneByBoardNum();
    const apiInfo = getApiInfo('GET', response, req);

    return processCtrl(res, apiInfo);
  },

  updateOneByBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.updateOneByBoardNum();
    const apiInfo = getApiInfo('PUT', response, req);

    return processCtrl(res, apiInfo);
  },

  updateOnlyHitByBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.updateOnlyHitByBoardNum();
    const apiInfo = getApiInfo('PATCH', response, req);

    return processCtrl(res, apiInfo);
  },

  deleteOneByBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.deleteOneByBoardNum();
    const apiInfo = getApiInfo('DELETE', response, req);

    return processCtrl(res, apiInfo);
  },
};

module.exports = {
  process,
};

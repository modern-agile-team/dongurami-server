'use strict';

const Board = require('../../models/services/Board/Board');

const process = {
  findAllByCategoryNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.findAllByCategoryNum();

    if (response.success) res.status(200).json(response);
    else res.status(400).json(response);
  },

  findOneByBoardNum: async (req, res) => {
    const board = new Board(req);
    const response = await board.findOneByBoardNum();

    if (response.success) res.status(200).json(response);
    else res.status(400).json(response);
  },
};

module.exports = process;

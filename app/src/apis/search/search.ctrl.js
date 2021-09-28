'use strict';

const Board = require('../../models/services/Board/Board');

const process = {
  // 검색
  search: async (req, res) => {
    const board = new Board(req);
    const response = await board.search();

    if (response.success) {
      return res.status(200).json(response);
    }
    if (response.isError) {
      return res.status(500).json(response.clientMsg);
    }
    return res.status(400).json(response);
  },
};

module.exports = { process };

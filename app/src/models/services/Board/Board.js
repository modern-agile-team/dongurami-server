'use strict';

const BoardStorage = require('./BoardStorage');
const boardCategory = require('../Category/board');

class Board {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.query = req.query;
  }

  async findAllByCategoryNum() {
    const category = boardCategory[this.params.category];

    if (category === undefined)
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };

    try {
      const boards = await BoardStorage.findAllByCategoryNum(category);

      return { success: true, msg: '게시판 조회 성공', boards };
    } catch (err) {
      return err;
    }
  }

  async findOneByBoardNum() {
    const category = boardCategory[this.params.category];
    const boardNum = this.params.num;

    console.log(typeof boardNum);

    if (category === undefined)
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };

    try {
      const board = await BoardStorage.findOneByBoardNum(category, boardNum);

      if (board[0] === undefined)
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };
      return { success: true, msg: '게시글 조회 성공', board };
    } catch (err) {
      return err;
    }
  }
}

module.exports = Board;

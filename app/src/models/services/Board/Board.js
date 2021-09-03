'use strict';

const BoardStorage = require('./BoardStorage');
const boardCategory = require('../Category/board');
const Error = require('../../utils/Error');

class Board {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findAllByCategoryNum() {
    const category = boardCategory[this.params.category];

    if (category === undefined)
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };

    if (category >= 5)
      return { success: false, msg: '잘못된 URL의 접근입니다' };

    try {
      const boards = await BoardStorage.findAllByCategoryNum(category);

      return { success: true, msg: '게시판 조회 성공', boards };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에서 얘기해주세요.', err);
    }
  }

  async findOneByBoardNum() {
    const category = boardCategory[this.params.category];
    const boardNum = this.params.num;

    if (category === undefined)
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };

    if (category >= 5)
      return { success: false, msg: '잘못된 URL의 접근입니다' };

    try {
      const board = await BoardStorage.findOneByBoardNum(category, boardNum);

      if (board[0] === undefined)
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };
      return { success: true, msg: '게시글 조회 성공', board };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에서 얘기해주세요.', err);
    }
  }
}

module.exports = Board;

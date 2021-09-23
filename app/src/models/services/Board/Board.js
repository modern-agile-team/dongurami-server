'use strict';

const BoardStorage = require('./BoardStorage');
const Error = require('../../utils/Error');
const boardCategory = require('../Category/board');

class Board {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async createBoardNum() {
    const category = boardCategory[this.params.category];

    try {
      const request = this.body;
      const boardInfo = {
        category,
        id: request.id,
        clubNo: request.clubNo,
        title: request.title,
        description: request.description,
      };
      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      return { success: true, msg: '게시글 생성 성공', boardNum };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByCategoryNum() {
    const criteriaRead = {
      category: boardCategory[this.params.category],
      sort: this.params.sort,
      order: this.params.order.toUpperCase(),
    };

    if (criteriaRead.category === undefined) {
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };
    }
    if (criteriaRead.category > 3) {
      return { success: false, msg: '잘못된 URL의 접근입니다' };
    }

    try {
      const boards = await BoardStorage.findAllByCategoryNum(criteriaRead);

      return { success: true, msg: '게시판 조회 성공', boards };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByPromotionCategory() {
    try {
      const criteriaRead = {
        clubCategory: this.params.clubCategory,
        sort: this.params.sort,
        order: this.params.order.toUpperCase(),
      };
      const boards = await BoardStorage.findAllByPromotionCategory(
        criteriaRead
      );

      return { success: true, msg: '장르별 조회 성공', boards };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findOneByBoardNum() {
    try {
      const category = boardCategory[this.params.category];
      const boardInfo = {
        category,
        boardNum: this.params.boardNum,
      };
      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (board === undefined)
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };
      return { success: true, msg: '게시글 조회 성공', board };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateOneByBoardNum() {
    try {
      const boardInfo = {
        title: this.body.title,
        description: this.body.description,
        boardNum: this.params.boardNum,
      };
      const updateBoardCnt = await BoardStorage.updateOneByBoardNum(boardInfo);

      if (updateBoardCnt === 0) {
        return { success: false, msg: '해당 게시글이 없습니다.' };
      }
      return { success: true, msg: '게시글 수정 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async deleteOneByBoardNum() {
    try {
      const { boardNum } = this.params;
      const deleteBoardCnt = await BoardStorage.deleteOneByBoardNum(boardNum);

      if (deleteBoardCnt === 0) {
        return { success: false, msg: '해당 게시글이 없습니다.' };
      }
      return { success: true, msg: '게시글 삭제 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateOnlyHitByNum() {
    try {
      const { boardNum } = this.params;
      await BoardStorage.updateOnlyHitByNum(boardNum);

      return { success: true, msg: '조회수 1 증가' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Board;

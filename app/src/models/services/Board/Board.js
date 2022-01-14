'use strict';

const BoardStorage = require('./BoardStorage');
const AdminoOptionStorage = require('../AdminOption/AdminOptionStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');
const makeResponse = require('../../utils/makeResponse');

class Board {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
    this.query = req.query;
  }

  async createBoardNum() {
    const user = this.auth;
    const board = this.body;
    const { clubNum } = this.params;
    const category = boardCategory[this.params.category];

    try {
      const boardInfo = {
        category,
        clubNum: 1,
        id: user.id,
        title: board.title,
        description: board.description,
        hiddenFlag: board.hiddenFlag || 0,
      };

      if (category === 1 && user.isAdmin === 0) {
        return makeResponse(400, '전체공지는 관리자만 작성 가능합니다.');
      }

      if (!(board.title && board.description)) {
        return makeResponse(404, '제목이나 본문이 존재하지 않습니다.');
      }

      if (clubNum !== undefined && this.params.clubNum > 1) {
        boardInfo.clubNum = clubNum;
      } else if (category === 4) {
        if (board.images.length === 0) {
          return makeResponse(400, '사진을 첨부해주세요');
        }
        boardInfo.clubNum = board.clubNo;
      }

      if (category === 5 || category === 6) {
        if (!user.clubNum.includes(Number(clubNum))) {
          return makeResponse(403, '동아리원만 작성할 수 있습니다.');
        }
        if (boardInfo.hiddenFlag) {
          return makeResponse(400, '해당 게시판에서 익명 사용이 불가능합니다.');
        }
      }

      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      return makeResponse(201, '게시글 생성 성공', { boardNum });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByCategoryNum() {
    const category = boardCategory[this.params.category];
    const { clubNum } = this.params;
    const user = this.auth;
    const { query } = this;
    const criteriaRead = {
      category,
      clubNum: 1,
      sort: query.sort || 'inDate',
      order: query.order || 'desc',
    };

    try {
      if (category === undefined) {
        return makeResponse(404, '존재하지 않는 게시판 입니다.');
      }
      if (category === 4 || category === 7) {
        return makeResponse(400, '잘못된 URL의 접근입니다.');
      }
      if (category === 5 || category === 6) {
        const isClub = await BoardStorage.findClub(clubNum);

        if (!isClub) {
          return makeResponse(404, '존재하지 않는 동아리입니다.');
        }
        if (category === 5 && !user.isAdmin) {
          if (!user.clubNum.includes(Number(clubNum))) {
            return makeResponse(403, '해당 동아리에 가입하지 않았습니다.');
          }
        }
        criteriaRead.clubNum = clubNum;
      }
      if (category < 5 && this.params.clubNum !== undefined) {
        return makeResponse(400, '잘못된 URL의 접근입니다.');
      }

      const boards = await BoardStorage.findAllByCategoryNum(criteriaRead);

      for (const board of boards) {
        if (board.writerHiddenFlag) {
          board.studentId = '익명';
          board.studentName = '익명';
          board.profileImageUrl = null;
        }
      }

      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
      }

      return makeResponse(200, '게시판 조회 성공', { userInfo, boards });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByPromotionCategory() {
    const user = this.auth;
    const { query } = this;

    try {
      const criteriaRead = {
        clubCategory: query.category,
        lastNum: query.lastNum,
        sort: query.sort || 'inDate',
        order: query.order || 'desc',
      };

      const boards = await BoardStorage.findAllByPromotionCategory(
        criteriaRead
      );

      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
          club: user.clubNum,
        };
      }

      return makeResponse(200, '장르별 조회 성공', { userInfo, boards });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findOneByBoardNum() {
    const user = this.auth;
    const { params } = this;

    try {
      const category = boardCategory[params.category];
      const boardInfo = {
        category,
        boardNum: params.boardNum,
        studentId: user ? user.id : 0,
      };

      if (category === 5 && !user.isAdmin) {
        if (!user.clubNum.includes(Number(clubNum))) {
          return makeResponse(403, '해당 동아리에 가입하지 않았습니다.');
        }
      }
      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (board === undefined) {
        return makeResponse(404, '해당 게시판에 존재하지 않는 글입니다.');
      }
      board.isWriter = boardInfo.studentId === board.studentId ? 1 : 0;

      if (board.writerHiddenFlag === 1) {
        board.name = '익명1';
        board.studentId = '익명1';
        board.profileImageUrl = null;
      }

      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
      }

      return makeResponse(200, '게시글 조회 성공', {
        userInfo,
        category,
        board,
      });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateOneByBoardNum() {
    const user = this.auth;
    const board = this.body;
    const { params } = this;

    try {
      const category = boardCategory[params.category];
      const boardInfo = {
        category,
        title: board.title,
        description: board.description,
        boardNum: params.boardNum,
        hiddenFlag: board.hiddenFlag || 0,
      };

      if (!(board.title && board.description)) {
        return makeResponse(400, '제목이나 본문이 존재하지 않습니다.');
      }
      if (category === 4 && board.images.length === 0) {
        return makeResponse(400, '사진을 첨부해주세요');
      }

      const writerCheck = await WriterCheck.ctrl(
        user.id,
        boardInfo.boardNum,
        'boards'
      );

      // 동아리 공지, 동아리 활동 내역은 자신이 작성한 글이 아니더라도, 게시글 편집 권한이 있다면 수정 가능
      if (category === 5 || category === 6) {
        const boardFlag = await AdminoOptionStorage.findBoardAdminFlag(
          params.clubNum,
          user.id
        );

        if (!writerCheck.success) {
          if (!boardFlag) {
            return makeResponse(403, '게시글 수정 권한이 없습니다.');
          }
          return writerCheck;
        }
      } else if (!writerCheck.success) return writerCheck;

      const updateBoardCnt = await BoardStorage.updateOneByBoardNum(boardInfo);

      if (updateBoardCnt === 0) {
        return makeResponse(404, '해당 게시글이 없습니다.');
      }
      return makeResponse(200, '게시글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteOneByBoardNum() {
    const user = this.auth;
    const { params } = this;

    try {
      const category = boardCategory[params.category];
      const boardInfo = {
        category,
        boardNum: params.boardNum,
      };

      const writerCheck = await WriterCheck.ctrl(
        user.id,
        boardInfo.boardNum,
        'boards'
      );

      // 동아리 공지, 동아리 활동 내역은 자신이 작성한 글이 아니더라도, 게시글 편집 권한이 있다면 삭제 가능
      if (category === 5 || category === 6) {
        const boardFlag = await AdminoOptionStorage.findBoardAdminFlag(
          params.clubNum,
          user.id
        );

        if (!writerCheck.success) {
          if (!boardFlag) {
            return makeResponse(403, '게시글 수정 권한이 없습니다.');
          }
          return writerCheck;
        }
      } else if (!writerCheck.success) return writerCheck;

      const deleteBoardCnt = await BoardStorage.deleteOneByBoardNum(boardInfo);

      if (deleteBoardCnt === 0) {
        return makeResponse(404, '해당 게시글이 없습니다.');
      }
      return makeResponse(200, '게시글 삭제 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateOnlyHitByNum() {
    try {
      const boardInfo = {
        category: boardCategory[this.params.category],
        boardNum: this.params.boardNum,
      };
      const userId = this.auth && this.auth.id;

      const writerCheck = await WriterCheck.ctrl(
        userId,
        boardInfo.boardNum,
        'boards'
      );

      if (writerCheck.success) {
        return makeResponse(202, '본이의 글은 조회수가 증가하지 않습니다.');
      }

      const updateBoardCnt = await BoardStorage.updateOnlyHitByNum(boardInfo);

      if (updateBoardCnt === 0) {
        return makeResponse(404, '해당 게시글이 없습니다.');
      }
      return makeResponse(200, '조회수 1 증가');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Board;

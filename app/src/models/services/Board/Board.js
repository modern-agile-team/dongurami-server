'use strict';

const BoardStorage = require('./BoardStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const BoardUtil = require('./Utils');
const boardCategory = require('../Category/board');
const makeResponse = require('../../utils/makeResponse');
const getRequestNullKey = require('../../utils/getRequestNullKey');

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
    const boardInfo = {
      clubNum: 1,
      id: user.id,
      title: board.title,
      description: board.description,
      category: boardCategory[this.params.category],
      hiddenFlag: board.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(board, ['title', 'description']);

    if (nullKey) {
      return makeResponse(404, `${nullKey}(가) 존재하지 않습니다.`);
    }

    if (boardInfo.category === 1 && !user.isAdmin) {
      return makeResponse(403, '전체공지는 관리자만 작성 가능합니다.');
    }

    if (clubNum !== undefined && clubNum > 1) boardInfo.clubNum = clubNum;

    if (boardInfo.category === 4) boardInfo.clubNum = board.clubNo;

    if (boardInfo.category > 3) {
      if (boardInfo.hiddenFlag) {
        return makeResponse(403, '해당 게시판에서 익명 사용이 불가능합니다.');
      }
      if (boardInfo.category === 5 || boardInfo.category === 6) {
        if (!user.clubNum.includes(Number(clubNum))) {
          return makeResponse(403, '동아리원만 작성할 수 있습니다.');
        }
      }
    }

    try {
      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      if (boardNum) return makeResponse(201, '게시글 생성 성공', { boardNum });
      return makeResponse(400, '게시글 생성 실패');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByCategoryNum() {
    const user = this.auth;
    const { clubNum } = this.params;
    const boardInfo = {
      clubNum: 1,
      category: boardCategory[this.params.category],
      sort: this.query.sort || 'inDate',
      order: this.query.order || 'desc',
    };

    if (boardInfo.category === undefined) {
      return makeResponse(404, '존재하지 않는 게시판 입니다.');
    }
    if (boardInfo.category === 4 || boardInfo.category === 7) {
      return makeResponse(400, '잘못된 URL의 접근입니다.');
    }
    if (boardInfo.category < 5 && clubNum !== undefined) {
      return makeResponse(400, '잘못된 URL의 접근입니다.');
    }

    try {
      if (boardInfo.category === 5 || boardInfo.category === 6) {
        const club = await BoardStorage.findClubByClubNum(clubNum);

        if (!club) {
          return makeResponse(404, '존재하지 않는 동아리입니다.');
        }

        if (boardInfo.category === 5 && !user.isAdmin) {
          if (!user.clubNum.includes(Number(clubNum))) {
            return makeResponse(403, '해당 동아리에 가입하지 않았습니다.');
          }
        }
        boardInfo.clubNum = clubNum;
      }

      const boards = await BoardStorage.findAllByCategoryNum(boardInfo);

      BoardUtil.changeAnonymous(boards);

      return makeResponse(200, '게시판 조회 성공', { boards });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByPromotionCategory() {
    const boardInfo = {
      clubCategory: this.query.category,
      lastNum: this.query.lastNum || 0,
      sort: this.query.sort || 'inDate',
      order: this.query.order || 'desc',
    };

    try {
      const boards = await BoardStorage.findAllByPromotionCategory(boardInfo);

      return makeResponse(200, '장르별 조회 성공', { boards });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findOneByBoardNum() {
    const user = this.auth;
    const boardInfo = {
      category: boardCategory[this.params.category],
      boardNum: this.params.boardNum,
      studentId: user ? user.id : 0,
    };
    const anonymous = {};
    let images;
    let comments;

    if (boardInfo.category === 5 && !user.isAdmin) {
      if (!user.clubNum.includes(Number(clubNum))) {
        return makeResponse(403, '해당 동아리에 가입하지 않았습니다.');
      }
    }

    try {
      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (!board) {
        return makeResponse(404, '해당 게시판에 존재하지 않는 글입니다.');
      }
      board.isWriter = boardInfo.studentId === board.studentId;

      if (boardInfo.category === 2 || boardInfo.category === 3) {
        BoardUtil.changeAnonymous([board]);
      }

      if (boardInfo.category === 4 || boardInfo.category === 6) {
        images = await BoardStorage.findAllImgByBoardNum(boardInfo.boardNum);
      }

      if (boardInfo.category < 6) {
        comments = await BoardStorage.findCmtAllByBoardNum(boardInfo);

        if (boardInfo.category < 5) {
          comments.forEach((comment) => {
            comment.isWriter = boardInfo.studentId === comment.studentId;

            if (comment.writerHiddenFlag) {
              const samePersonFlag = Object.keys(anonymous).includes(
                comment.studentId
              );

              if (samePersonFlag) {
                BoardUtil.samePersonAnonymization(anonymous, comment);
              } else {
                BoardUtil.newPersonAnonymization(anonymous, comment);
              }
            }
          });
        }
      }

      return makeResponse(200, '게시글 조회 성공', { board, comments, images });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateOneByBoardNum() {
    const user = this.auth;
    const boardInfo = {
      title: this.body.title,
      description: this.body.description,
      boardNum: this.params.boardNum,
      category: boardCategory[this.params.category],
      hiddenFlag: this.body.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(this.body, ['title', 'description']);

    if (nullKey) {
      return makeResponse(404, `${nullKey}(가) 존재하지 않습니다.`);
    }

    try {
      const isExist = await BoardStorage.existOnlyByBoardNum(boardInfo);

      if (!isExist) {
        return makeResponse(404, '해당 게시글이 존재하지 않습니다.');
      }

      const writerCheck = await WriterCheck.ctrl(
        user.id,
        boardInfo.boardNum,
        'boards'
      );

      if (!writerCheck.success) return writerCheck;

      if (boardInfo.category > 3) {
        if (boardInfo.hiddenFlag) {
          return makeResponse(403, '해당 게시판에서 익명 사용이 불가능합니다.');
        }

        if (boardInfo.category === 5 || boardInfo.category === 6) {
          const boardAdminFlag = await BoardStorage.findBoardAdminFlag({
            clubNum: this.params.clubNum,
            studentId: user.id,
          });

          if (!boardAdminFlag) {
            return makeResponse(403, '게시글 수정 권한이 없습니다.');
          }
        }
      }

      const isUpdate = await BoardStorage.updateOneByBoardNum(boardInfo);

      if (!isUpdate) return makeResponse(400, '알수없는 에러가 발생했습니다.');
      return makeResponse(200, '게시글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateOnlyHitByBoardNum() {
    const userId = this.auth && this.auth.id;
    const boardInfo = {
      category: boardCategory[this.params.category],
      boardNum: this.params.boardNum,
    };

    try {
      const isExist = await BoardStorage.existOnlyByBoardNum(boardInfo);

      if (!isExist) {
        return makeResponse(404, '해당 게시글이 존재하지 않습니다.');
      }

      const writerCheck = await WriterCheck.ctrl(
        userId,
        boardInfo.boardNum,
        'boards'
      );

      if (writerCheck.success) {
        return makeResponse(202, '본인의 글은 조회수가 증가하지 않습니다.');
      }

      const isUpdate = await BoardStorage.updateOnlyHitByBoardNum(boardInfo);

      if (!isUpdate) return makeResponse(400, '알수없는 에러가 발생했습니다.');
      return makeResponse(200, '조회수 1 증가');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteOneByBoardNum() {
    const user = this.auth;
    const boardInfo = {
      category: boardCategory[this.params.category],
      boardNum: this.params.boardNum,
    };

    try {
      const isExist = await BoardStorage.existOnlyByBoardNum(boardInfo);

      if (!isExist) {
        return makeResponse(404, '해당 게시글이 존재하지 않습니다.');
      }

      const writerCheck = await WriterCheck.ctrl(
        user.id,
        boardInfo.boardNum,
        'boards'
      );

      if (!writerCheck.success) return writerCheck;

      if (boardInfo.category === 5 || boardInfo.category === 6) {
        const boardAdminFlag = await BoardStorage.findBoardAdminFlag(
          this.params.clubNum,
          user.id
        );

        if (!boardAdminFlag) {
          return makeResponse(403, '게시글 삭제 권한이 없습니다.');
        }
      }

      const isDelete = await BoardStorage.deleteOneByBoardNum(boardInfo);

      if (!isDelete) return makeResponse(400, '알수없는 에러가 발생했습니다.');
      return makeResponse(200, '게시글 삭제 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Board;

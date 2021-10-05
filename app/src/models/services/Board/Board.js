'use strict';

const BoardStorage = require('./BoardStorage');
const Notification = require('../Notification/Notification');
const NotificationStorage = require('../Notification/NotificationStorage');
const Error = require('../../utils/Error');
const boardCategory = require('../Category/board');

class Board {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
    this.query = req.query;
  }

  async createBoardNum() {
    const board = this.body;
    const { clubNum } = this.params;
    const category = boardCategory[this.params.category];
    const notification = new Notification(this.req);

    try {
      const boardInfo = {
        category,
        clubNum: 1,
        id: this.auth.id,
        title: board.title,
        description: board.description,
      };

      if (clubNum !== undefined) {
        boardInfo.clubNum = clubNum;
      } else if (category === 4) {
        boardInfo.clubNum = board.clubNo;
      }

      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      if (category === 5) {
        const senderId = boardInfo.id;
        const recipientIds = await NotificationStorage.findAllByClubNum(
          boardInfo.clubNum
        );

        recipientIds.forEach(async (recipientId) => {
          if (senderId !== recipientId) {
            const notificationInfo = {
              recipientId,
              senderId,
              clubName: board.clubName,
              content: boardInfo.title,
            };

            await notification.createByIdAndClubName(notificationInfo);
          }
        });
      }

      return { success: true, msg: '게시글 생성 성공', boardNum };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByCategoryNum() {
    const category = boardCategory[this.params.category];
    const { clubNum } = this.params;
    const user = this.auth;
    const criteriaRead = {
      clubNum: 1,
      category,
      sort: this.params.sort,
      order: this.params.order.toUpperCase(),
    };

    if (category === undefined) {
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };
    }
    if (category === 4 || category === 7) {
      return { success: false, msg: '잘못된 URL의 접근입니다' };
    }
    if (category === 5 || category === 6) {
      if (category === 5 && !user.clubNum.includes(Number(clubNum))) {
        return { success: false, msg: '해당 동아리에 가입하지 않았습니다.' };
      }
      criteriaRead.clubNum = clubNum;
    }
    if (category < 5 && this.params.clubNum !== undefined) {
      return { success: false, msg: '잘못된 URL의 접근입니다.' };
    }

    try {
      const boards = await BoardStorage.findAllByCategoryNum(criteriaRead);
      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
      }

      return { success: true, msg: '게시판 조회 성공', userInfo, boards };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByPromotionCategory() {
    const user = this.auth;
    const { params } = this;

    try {
      const criteriaRead = {
        clubCategory: params.clubCategory,
        sort: params.sort,
        order: params.order.toUpperCase(),
      };
      const boards = await BoardStorage.findAllByPromotionCategory(
        criteriaRead
      );
      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          club: user.clubNum,
        };
      }

      return { success: true, msg: '장르별 조회 성공', userInfo, boards };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
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
      };

      if (category === 5 && !user.clubNum.includes(Number(params.clubNum))) {
        return { success: false, msg: '해당 동아리에 가입하지 않았습니다.' };
      }

      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (board === undefined)
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };

      let userInfo = '비로그인 회원입니다.';

      if (user)
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
        };

      return {
        success: true,
        msg: '게시글 조회 성공',
        userInfo,
        category,
        board,
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateOneByBoardNum() {
    const board = this.body;
    const { params } = this;

    try {
      const category = boardCategory[params.category];
      const boardInfo = {
        category,
        title: board.title,
        description: board.description,
        boardNum: params.boardNum,
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
    const { params } = this;

    try {
      const category = boardCategory[params.category];
      const boardInfo = {
        category,
        boardNum: params.boardNum,
      };
      const deleteBoardCnt = await BoardStorage.deleteOneByBoardNum(boardInfo);

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

  async search() {
    const searchInfo = this.query;
    const searchType = ['title', 'name'];

    searchInfo.category = boardCategory[this.query.category];
    if (searchInfo.category === undefined) {
      return { success: false, msg: '존재하지 않는 게시판입니다.' };
    }

    if (searchInfo.category > 3) {
      if (searchInfo.clubno === '1' || !searchInfo.clubno) {
        return {
          success: false,
          msg: '동아리 고유번호를 확인해주세요.',
        };
      }
    } else {
      searchInfo.clubno = 1;
    }

    if (!searchType.includes(searchInfo.type)) {
      return { success: false, msg: '검색 타입을 확인해주세요' };
    }

    if (searchInfo.type === 'name') searchInfo.type = 'st.name';

    try {
      const boards = await BoardStorage.findAllSearch(searchInfo);

      return {
        success: true,
        msg: `${searchInfo.type}타입으로 ${searchInfo.keyword}(을)를 검색한 결과입니다.`,
        boards,
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Board;

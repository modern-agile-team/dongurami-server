'use strict';

const BoardStorage = require('./BoardStorage');
const Notification = require('../Notification/Notification');
const NotificationStorage = require('../Notification/NotificationStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
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
    const user = this.auth;
    const board = this.body;
    const { clubNum } = this.params;
    const category = boardCategory[this.params.category];
    const notification = new Notification(this.req);

    try {
      const boardInfo = {
        category,
        clubNum: 1,
        id: user.id,
        title: board.title,
        description: board.description,
      };

      if (category === 1 && user.isAdmin === 0) {
        return {
          success: false,
          msg: '공지게시판은 관리자만 접근할 수 있습니다.',
        };
      }

      if (!(board.title && board.description)) {
        return { success: false, msg: '제목이나 본문이 존재하지 않습니다.' };
      }

      if (clubNum !== undefined && this.params.clubNum > 1) {
        boardInfo.clubNum = clubNum;
      } else if (category === 4) {
        if (board.images.length === 0) {
          return { success: false, msg: '사진을 첨부해주세요' };
        }
        boardInfo.clubNum = board.clubNo;
      }

      if (category === 5 || category === 6) {
        if (!user.clubNum.includes(Number(clubNum))) {
          return { success: false, msg: '동아리원만 작성할 수 있습니다.' };
        }
      }

      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      if (category === 5) {
        const senderName = user.name;

        const recipientNames = await NotificationStorage.findAllByClubNum(
          boardInfo.clubNum
        );

        const clubName = await NotificationStorage.findOneByClubNum(
          boardInfo.clubNum
        );

        recipientNames.forEach(async (recipientName) => {
          if (senderName !== recipientName) {
            const notificationInfo = {
              recipientName,
              senderName,
              clubName,
              content: boardInfo.title,
            };

            await notification.createNotification(notificationInfo);
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
    const { query } = this;
    const criteriaRead = {
      clubNum: 1,
      category,
      sort: query.sort || 'inDate',
      order: query.order || 'desc',
    };

    if (category === undefined) {
      return { success: false, msg: '존재하지 않는 게시판 입니다.' };
    }
    if (category === 4 || category === 7) {
      return { success: false, msg: '잘못된 URL의 접근입니다' };
    }
    if (category === 5 || category === 6) {
      const isClub = await BoardStorage.findClub(clubNum);

      if (!isClub) {
        return { success: false, msg: '존재하지 않는 동아리입니다.' };
      }
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

      if (category === 1 && user.isAdmin === 0) {
        return {
          success: false,
          msg: '공지게시판은 관리자만 접근할 수 있습니다.',
        };
      }

      if (!(board.title && board.description)) {
        return { success: false, msg: '제목이나 본문이 존재하지 않습니다.' };
      }
      if (category === 4 && board.images.length === 0) {
        return { success: false, msg: '사진을 첨부해주세요' };
      }

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        boardInfo.boardNum,
        'boards'
      );

      if (!writerCheck.success) return writerCheck;

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

      if (category === 1 && user.isAdmin === 0) {
        return {
          success: false,
          msg: '공지게시판은 관리자만 접근할 수 있습니다.',
        };
      }

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        boardInfo.boardNum,
        'boards'
      );

      if (!writerCheck.success) return writerCheck;

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

    searchInfo.category = boardCategory[this.params.category];

    if (!searchInfo.category) {
      return { success: false, msg: '존재하지 않는 게시판입니다.' };
    }
    if (!searchType.includes(searchInfo.type)) {
      return { success: false, msg: '검색 타입을 확인해주세요' };
    }
    if (searchInfo.type === 'name') searchInfo.type = 'st.name';

    try {
      if (searchInfo.category === 5) {
        if (searchInfo.clubno === '1' || !searchInfo.clubno) {
          return {
            success: false,
            msg: '동아리 고유번호를 확인해주세요.',
          };
        }
      } else {
        searchInfo.clubno = 1;
      }

      const boards = await BoardStorage.findAllSearch(searchInfo);

      return {
        success: true,
        msg: `${searchInfo.keyword}(을)를 검색한 결과입니다.`,
        boards,
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  async promotionSearch() {
    const { query } = this;
    const searchType = ['title', 'clubName'];

    if (!searchType.includes(query.type)) {
      return { success: false, msg: '검색 타입을 확인해주세요' };
    }
    if (query.type === 'clubName') query.type = 'clubs.name';

    try {
      const searchInfo = {
        type: query.type,
        keyword: query.keyword,
        sort: query.sort || 'inDate',
        order: query.order || 'desc',
        lastNum: query.lastNum,
      };
      const boards = await BoardStorage.findAllPromotionSearch(searchInfo);

      return {
        success: true,
        msg: `${searchInfo.keyword}(을)를 검색한 결과입니다.`,
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

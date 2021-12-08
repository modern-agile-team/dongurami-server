'use strict';

const BoardStorage = require('./BoardStorage');
const Notification = require('../Notification/Notification');
const NotificationStorage = require('../Notification/NotificationStorage');
const AdminoOptionStorage = require('../AdminOption/AdminOptionStorage');
const StudentStorage = require('../Student/StudentStorage');
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
        hiddenFlag: board.hiddenFlag || 0,
      };

      if (category === 1 && user.isAdmin === 0) {
        return {
          success: false,
          msg: '전체공지는 관리자만 작성 가능합니다.',
          status: 403,
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
          return {
            success: false,
            msg: '동아리원만 작성할 수 있습니다.',
            status: 403,
          };
        }
        if (boardInfo.hiddenFlag) {
          return {
            success: false,
            msg: '해당 게시판에서 익명 사용이 불가능합니다.',
          };
        }
      }

      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      if (category === 1) {
        const senderId = boardInfo.id;

        const recipients = await StudentStorage.findAllNameAndId();

        recipients.forEach(async (recipient) => {
          if (senderId !== recipient.id) {
            const notificationInfo = {
              title: '공지 게시판',
              senderName: user.name,
              recipientName: recipient.name,
              recipientId: recipient.id,
              content: boardInfo.title,
              url: `notice/${boardNum}`,
            };

            await notification.createNotification(notificationInfo);
          }
        });
      }

      if (category === 5) {
        const senderId = boardInfo.id;

        const recipients = await NotificationStorage.findAllByClubNum(
          boardInfo.clubNum
        );

        const { clubName } = await NotificationStorage.findClubInfoByClubNum(
          boardInfo.clubNum
        );

        recipients.forEach(async (recipient) => {
          if (senderId !== recipient.id) {
            const notificationInfo = {
              clubName,
              senderName: user.name,
              recipientName: recipient.name,
              recipientId: recipient.id,
              content: boardInfo.title,
              url: `clubhome/${clubNum}/notice/${boardNum}`,
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
      category,
      clubNum: 1,
      sort: query.sort || 'inDate',
      order: query.order || 'desc',
    };

    try {
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
        if (category === 5 && !user.isAdmin) {
          if (!user.clubNum.includes(Number(clubNum))) {
            return {
              success: false,
              msg: '해당 동아리에 가입하지 않았습니다.',
            };
          }
        }
        criteriaRead.clubNum = clubNum;
      }
      if (category < 5 && this.params.clubNum !== undefined) {
        return { success: false, msg: '잘못된 URL의 접근입니다.' };
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
        studentId: user ? user.id : 0,
      };

      if (category === 5 && !user.isAdmin) {
        if (!user.clubNum.includes(Number(clubNum))) {
          return {
            success: false,
            msg: '해당 동아리에 가입하지 않았습니다.',
          };
        }
      }
      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (board === undefined) {
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };
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
        return { success: false, msg: '제목이나 본문이 존재하지 않습니다.' };
      }
      if (category === 4 && board.images.length === 0) {
        return { success: false, msg: '사진을 첨부해주세요' };
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
            return { success: false, msg: '게시글 수정 권한이 없습니다.' };
          }
          return writerCheck;
        }
      } else if (!writerCheck.success) return writerCheck;

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
            return { success: false, msg: '게시글 수정 권한이 없습니다.' };
          }
          return writerCheck;
        }
      } else if (!writerCheck.success) return writerCheck;

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
      const boardInfo = {
        category: boardCategory[this.params.category],
        boardNum: this.params.boardNum,
      };

      const updateBoardCnt = await BoardStorage.updateOnlyHitByNum(boardInfo);

      if (updateBoardCnt === 0) {
        return { success: false, msg: '해당 게시글이 없습니다.' };
      }
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

      boards.forEach((post) => {
        if (post.writerHiddenFlag) {
          post.studentId = '익명';
          post.studentName = '익명';
          post.url = null;
        }
      });

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

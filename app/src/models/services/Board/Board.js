'use strict';

const BoardStorage = require('./BoardStorage');
const Error = require('../../utils/Error');
const boardCategory = require('../Category/board');

class Board {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createBoardNum() {
    try {
      const category = boardCategory[this.params.category];
      const request = this.body;
      const boardInfo = {
        category,
        clubNum: 1,
        id: this.auth.id,
        title: request.title,
        description: request.description,
      };

      if (this.params.clubNum !== undefined) {
        boardInfo.clubNum = this.params.clubNum;
      } else if (category === 4) {
        boardInfo.clubNum = request.clubNo;
      }

      const boardNum = await BoardStorage.createBoardNum(boardInfo);

      return { success: true, msg: '게시글 생성 성공', boardNum };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByCategoryNum() {
    const category = boardCategory[this.params.category];
    const { clubNum } = this.params;
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
      if (category === 5 && !this.auth.clubNum.includes(Number(clubNum))) {
        return { success: false, msg: '해당 동아리에 가입하지 않았습니다.' };
      }
      criteriaRead.clubNum = clubNum;
    }

    try {
      const boards = await BoardStorage.findAllByCategoryNum(criteriaRead);
      let userInfo = '비로그인 회원입니다.';

      if (this.auth)
        userInfo = {
          id: this.auth.id,
          isAdmin: this.auth.isAdmin,
        };

      return { success: true, msg: '게시판 조회 성공', userInfo, boards };
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
      let userInfo = '비로그인 회원입니다.';

      if (this.auth) {
        userInfo = {
          id: this.auth.id,
          club: this.auth.clubNum,
        };
      }

      return { success: true, msg: '장르별 조회 성공', userInfo, boards };
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

      if (
        category === 5 &&
        !this.auth.clubNum.includes(Number(this.params.clubNum))
      ) {
        return { success: false, msg: '해당 동아리에 가입하지 않았습니다.' };
      }

      const board = await BoardStorage.findOneByBoardNum(boardInfo);

      if (board === undefined)
        return {
          success: false,
          msg: '해당 게시판에 존재하지 않는 글 입니다.',
        };

      let userInfo = '비로그인 회원입니다.';

      if (this.auth)
        userInfo = {
          id: this.auth.id,
          isAdmin: this.auth.isAdmin,
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
    try {
      const category = boardCategory[this.params.category];
      const boardInfo = {
        category,
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
      const category = boardCategory[this.params.category];
      const boardInfo = {
        category,
        boardNum: this.params.boardNum,
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
    // 검색을 위한 정보
    const searchInfo = {
      category: boardCategory[this.params.category],
      type: this.params.type,
      keyword: this.params.keyword,
      sort: this.params.sort,
      order: this.params.order,
    };
    const searchType = ['title', 'name'];

    // 게시판 유무 검증
    if (searchInfo.category === undefined) {
      return { success: false, msg: '존재하지 않는 게시판입니다.' };
    }

    // 검색타입 검증
    if (!searchType.includes(searchInfo.type)) {
      return { success: false, msg: '검색 타입을 확인해주세요' };
    }

    // DB 검색을 위한 type변수명 변경
    if (searchInfo.type === 'name') searchInfo.type = 'st.name';

    try {
      // 검색결과, 함수이동
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

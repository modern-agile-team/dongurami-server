'use strict';

const BoardStorage = require('../Board/BoardStorage');
const boardCategory = require('../Category/board');
const Error = require('../../utils/Error');

class Search {
  constructor(req) {
    this.params = req.params;
    this.query = req.query;
  }

  async search() {
    const searchInfo = this.query;

    try {
      const searchCategoryCheck = this.searchCategoryCheck();
      if (searchCategoryCheck.msg) return searchCategoryCheck;

      const searchTypeCheck = this.searchTypeCheck();
      if (searchTypeCheck.msg) return searchTypeCheck;

      const searchClubNoCheck = this.searchClubNoCheck();
      if (searchClubNoCheck.msg) return searchClubNoCheck;

      const result = await BoardStorage.findAllSearch(searchInfo);

      result.forEach((post) => {
        if (post.writerHiddenFlag) {
          post.studentId = '익명';
          post.studentName = '익명';
          post.url = null;
        }
      });

      return {
        success: true,
        msg: `${searchInfo.keyword}(을)를 검색한 결과입니다.`,
        result,
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }

  searchCategoryCheck() {
    const searchInfo = this.query;
    searchInfo.category = boardCategory[this.params.category];

    return !searchInfo.category
      ? { success: false, msg: '존재하지 않는 게시판입니다.' }
      : searchInfo;
  }

  searchTypeCheck() {
    const searchInfo = this.query;
    const searchType = ['title', 'name', 'clubName'];

    if (!searchType.includes(searchInfo.type)) {
      return { success: false, msg: '검색 타입을 확인해주세요' };
    }
    if (searchInfo.type === 'name') searchInfo.type = 'st.name';
    if (searchInfo.type === 'clubName') searchInfo.type = 'clubs.name';

    return searchInfo;
  }

  searchClubNoCheck() {
    const searchInfo = this.query;

    if (searchInfo.category === 5) {
      if (searchInfo.clubno === '1' || !searchInfo.clubno) {
        return {
          success: false,
          msg: '동아리 고유번호를 확인해주세요.',
        };
      }
    }
    searchInfo.clubno = 1;
    return searchInfo;
  }

  async promotionSearch() {
    const { query } = this;

    try {
      const searchTypeCheck = this.searchTypeCheck();
      if (searchTypeCheck.msg) return searchTypeCheck;

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

module.exports = Search;

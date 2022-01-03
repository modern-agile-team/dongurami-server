'use strict';

const BoardStorage = require('../Board/BoardStorage');
const boardCategory = require('../Category/board');
const Error = require('../../utils/Error');
const ClubStorage = require('../Club/ClubStorage');

class Search {
  constructor(req) {
    this.params = req.params;
    this.query = req.query;
  }

  static makeResponseMsg(status, target, result) {
    return {
      success: status === 200,
      msg:
        status === 200
          ? `${target}(을)를 검색한 결과입니다.`
          : `${target}을(를) 확인해주세요`,
      status,
      result,
    };
  }

  static anonymousUserFilter(result) {
    result.forEach((post) => {
      if (post.writerHiddenFlag) {
        post.studentId = '익명';
        post.studentName = '익명';
        post.url = null;
      }
    });
  }

  async findAllSearch() {
    const searchInfo = this.query;

    try {
      const searchCategoryCheck = this.searchCategoryCheck();
      if (searchCategoryCheck.msg) return searchCategoryCheck;

      const searchTypeCheck = this.searchTypeCheck();
      if (searchTypeCheck.msg) return searchTypeCheck;

      const searchClubNoCheck = this.searchClubNoCheck();
      if (searchClubNoCheck.msg) return searchClubNoCheck;

      const result = await BoardStorage.findAllSearch(searchInfo);

      Search.anonymousUserFilter(result);

      return Search.makeResponseMsg(200, searchInfo.keyword, result);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  searchCategoryCheck() {
    const searchInfo = this.query;
    searchInfo.category = boardCategory[this.params.category];

    return !searchInfo.category
      ? Search.makeResponseMsg(400, '게시판')
      : searchInfo;
  }

  searchTypeCheck() {
    const searchInfo = this.query;
    const searchType = ['title', 'name', 'clubName'];

    if (!searchType.includes(searchInfo.type)) {
      return Search.makeResponseMsg(400, '검색 타입');
    }

    Search.searchTypeChange(searchInfo);

    return searchInfo;
  }

  static searchTypeChange(searchInfo) {
    if (searchInfo.type === 'name') searchInfo.type = 'st.name';
    if (searchInfo.type === 'clubName') searchInfo.type = 'clubs.name';
  }

  searchClubNoCheck() {
    const searchInfo = this.query;

    if (searchInfo.category === 5) {
      if (searchInfo.clubno === '1' || !searchInfo.clubno) {
        return Search.makeResponseMsg(400, '동아리 고유번호');
      }
    }
    searchInfo.clubno = 1;

    return searchInfo;
  }

  async findAllPromotionSearch() {
    const { query } = this;

    try {
      const searchTypeCheck = this.searchTypeCheck();
      if (searchTypeCheck.msg) return searchTypeCheck;

      const searchInfo = {
        type: query.type,
        keyword: query.keyword,
        lastNum: query.lastNum,
        sort: query.sort || 'inDate',
        order: query.order || 'desc',
      };

      const boards = await BoardStorage.findAllPromotionSearch(searchInfo);

      return Search.makeResponseMsg(200, searchInfo.keyword, boards);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllClubList() {
    const { name } = this.query;

    try {
      const clubs = await ClubStorage.findAllClubList(name);

      return Search.makeResponseMsg(200, name, clubs);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Search;

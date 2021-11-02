'use strict';

const clubStorage = require('./ClubStorage');
const Error = require('../../utils/Error');

class Club {
  constructor(req) {
    this.query = req.query;
  }

  async clubListSearch() {
    const { name } = this.query;

    try {
      const clubs = await clubStorage.clubListSearch(name);

      return {
        success: true,
        msg: `${name}(을)를 검색한 결과입니다.`,
        clubs,
      };
    } catch (err) {
      return Error.ctrl(
        '알 수 없는 오류입니다. 서버개발자에게 문의하세요.',
        err
      );
    }
  }
}

module.exports = Club;

'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
const Error = require('../../utils/Error');

class AdminOption {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByClubNum() {
    const clubNum = Number(this.params.clubNum);
    // 1. 동아리원 학생과 회장 출력
    try {
      const { success, members, leader } =
        await AdminOptionStorage.findOneByClubNum(clubNum);

      if (success) {
        return { success: true, members, leader };
      }
      return { success: false, msg: '서버에러' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
    // 2. 권한이 있는 학생들 출력
  }
}

module.exports = AdminOption;

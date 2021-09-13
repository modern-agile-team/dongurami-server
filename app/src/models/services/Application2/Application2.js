'use strict';

const ApplicationStorage2 = require('./ApplicationStorage2');
const Error = require('../../utils/Error');

class Application2 {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneApplicationByClubNum() {
    const clubNum = Number(this.params.clubNum);

    try {
      const { applicationInfo } =
        await ApplicationStorage2.findOneApplicationByClubNum(clubNum);

      return { success: true, applicationInfo };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Application2;

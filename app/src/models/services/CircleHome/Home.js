'use strict';

const HomeStorage = require('./HomeStorage');
const Error = require('../../utils/Error');

class Home {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByClubNum() {
    try {
      const clubInfo = {
        clubNum: this.params.clubNum,
        id: this.auth.id,
      };
      const { success, clientInfo, result } =
        await HomeStorage.findOneByClubNum(clubInfo);

      if (success) {
        return { success: true, clientInfo, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async updateClubInfo() {
    try {
      const clubInfo = {
        clubNum: this.params.clubNum,
        introduce: this.body.introduce,
      };
      await HomeStorage.updateClubInfo(clubInfo);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async updateClubLogo() {
    const data = this.body;

    try {
      const logoInfo = {
        clubNum: this.params.clubNum,
        logoUrl: data.logoUrl,
      };
      await HomeStorage.updateClubLogo(logoInfo);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = Home;

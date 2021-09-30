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
    const { clubNum } = this.params;

    try {
      const info = {
        clubNum,
        id: this.auth.id,
      };
      const { success, clientInfo, result } =
        await HomeStorage.findOneByClubNum(info);

      if (success) {
        return { success: true, clientInfo, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async updateClubInfo() {
    const { clubNum } = this.params;
    const data = this.body;

    try {
      const clubInfo = {
        clubNum,
        introduce: data.introduce,
      };
      await HomeStorage.updateClubInfo(clubInfo);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async updateClubLogo() {
    const data = this.body;
    const { clubNum } = this.params;

    try {
      const logoInfo = {
        clubNum,
        logoUrl: data.logoUrl,
        fileId: data.fileId,
      };
      await HomeStorage.updateClubLogo(logoInfo);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = Home;

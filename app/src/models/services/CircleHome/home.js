'use strict';

const homeStorage = require('./homeStorage');

class Home {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findOneByClubNum() {
    const { clubNum } = this.params;
    try {
      const { success, result } = await homeStorage.findOneByClubNum(clubNum);
      if (success) {
        return { success: true, result };
      }
      return { success: false, msg: result };
    } catch (err) {
      return { success: false, msg: '개발자에게 문의해주세요' };
    }
  }

  async saveClub() {
    const data = this.body;
    try {
      const clubInfo = {
        introduce: data.introduce,
        logoUrl: data.logoUrl,
        fileId: data.fileId,
        clubNum: this.params.clubNum,
      };
      const result = await homeStorage.saveClub(clubInfo);
      return result;
    } catch (err) {
      return { success: false, msg: '개발자에게 문의해주세요' };
    }
  }
}

module.exports = Home;

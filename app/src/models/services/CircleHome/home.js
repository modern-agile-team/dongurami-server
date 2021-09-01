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
      const homes = await homeStorage.findOneByClubNum(clubNum);
      if (homes) {
        return { success: true, homes };
      }
    } catch (err) {
      return { success: false };
    }
    return console.log('어디선가 잘못 되었군...');
  }

  async saveClub() {
    const data = this.body;
    const { params } = this;
    try {
      const clubInfo = {
        introduce: data.introduce,
        logo_url: data.logo_url,
        file_id: data.file_id,
        clubNum: params.clubNum,
      };
      const result = await homeStorage.saveClub(clubInfo);
      return result;
    } catch (err) {
      console.log(err);
    }
    return console.log('뭐가 문제징');
  }
}

module.exports = Home;

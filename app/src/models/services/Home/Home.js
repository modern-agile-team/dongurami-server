'use strict';

const HomeStorage = require('./HomeStorage');
const Error = require('../../utils/Error');

class Home {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  static makesMsg(status, msg, result) {
    const success = status < 400;

    return {
      success,
      msg,
      result,
    };
  }

  async findOneLeader() {
    const { clubNum } = this.params;
    const leaderInfo = await HomeStorage.findOneLeader(clubNum);

    return leaderInfo;
  }

  async findOneClient(leaderId) {
    const ids = {
      leaderId,
      clientId: this.auth.id,
    };
    const clientInfo = await HomeStorage.findOneClient(ids);

    return clientInfo;
  }

  async findOneClubInfo() {
    const { clubNum } = this.params;
    const clubInfo = await HomeStorage.findOneClubInfo(clubNum);

    return clubInfo;
  }

  async checkClubGender() {
    const { clubNum } = this.params;
    const gender = await HomeStorage.checkClubGender(clubNum);

    return gender;
  }

  async findOneByClubNum() {
    try {
      const leaderInfo = await this.findOneLeader();

      if (!leaderInfo) {
        return Home.makesMsg(404, '존재하지 않는 동아리입니다.');
      }

      const clientInfo = await this.findOneClient(leaderInfo.id);
      const clubInfo = await this.findOneClubInfo();
      clubInfo.gender = await this.checkClubGender();

      return Home.makesMsg(200, '동아리홈 조회 성공', {
        leaderInfo,
        clientInfo,
        clubInfo,
      });
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async isLeader() {
    const { clubNum } = this.params;

    const leader = await HomeStorage.isLeader(clubNum);

    return leader;
  }

  async updateClubIntroduce() {
    try {
      const clubInfo = {
        clubNum: this.params.clubNum,
        introduce: this.body.introduce,
      };

      if ((await this.isLeader()).leader === this.auth.id) {
        await HomeStorage.updateClubIntroduce(clubInfo);

        return Home.makesMsg(200, '동아리 소개가 수정되었습니다.');
      }
      return Home.makesMsg(403, '소개 수정 권한이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateClubLogo() {
    try {
      const logoInfo = {
        clubNum: this.params.clubNum,
        logoUrl: this.body.logoUrl,
      };

      if ((await this.isLeader()).leader === this.auth.id) {
        await HomeStorage.updateClubLogo(logoInfo);

        return Home.makesMsg(200, '로고가 수정되었습니다.');
      }
      return Home.makesMsg(403, '로고 수정 권한이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Home;

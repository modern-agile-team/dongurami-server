'use strict';

const HomeStorage = require('./HomeStorage');
const Error = require('../../utils/Error');

class Home {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
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

  async findOneByClubNum() {
    try {
      const leaderInfo = await this.findOneLeader();

      if (!leaderInfo) {
        return { success: false, msg: '존재하지 않는 동아리입니다.' };
      }

      const clientInfo = await this.findOneClient(leaderInfo.id);
      const clubInfo = await this.findOneClubInfo();

      return {
        success: true,
        msg: '동아리홈 조회 성공',
        leaderInfo,
        clientInfo,
        clubInfo,
      };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  // async xxfindOneByClubNum() {
  //   try {
  //     const clubInfo = {
  //       clubNum: this.params.clubNum,
  //       id: this.auth.id,
  //     };
  //     const { success, leaderInfo, clientInfo, result } =
  //       await HomeStorage.xxfindOneByClubNum(clubInfo);

  //     if (success) {
  //       return {
  //         success: true,
  //         msg: '동아리홈 조회 성공',
  //         leaderInfo,
  //         clientInfo,
  //         result,
  //       };
  //     }
  //     return { success: false, msg: result };
  //   } catch (err) {
  //     return Error.ctrl('개발자에게 문의해주세요', err);
  //   }
  // }

  async updateClubInfo() {
    const data = this.body;

    try {
      const { leader } = data;
      const clubInfo = {
        clubNum: this.params.clubNum,
        introduce: data.introduce,
      };

      if (leader) {
        await HomeStorage.updateClubInfo(clubInfo);

        return { success: true, msg: '동아리 소개가 수정되었습니다.' };
      }
      return { success: false, msg: '소개 수정 권한이 없습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async updateClubLogo() {
    const data = this.body;

    try {
      const { leader } = data;
      const logoInfo = {
        clubNum: this.params.clubNum,
        logoUrl: data.logoUrl,
      };

      if (leader) {
        await HomeStorage.updateClubLogo(logoInfo);

        return { success: true, msg: '로고가 수정되었습니다.' };
      }
      return { success: false, msg: '로고 수정 권한이 없습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = Home;

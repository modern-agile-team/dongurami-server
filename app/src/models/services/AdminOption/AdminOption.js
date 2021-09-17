'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
const Error = require('../../utils/Error');

class AdminOption {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async checkClubAdmin() {
    const payload = this.auth;
    const { clubNum } = this.params;
    const adminInfo = {
      id: payload.id,
      clubNum,
    };
    try {
      const clubAdmin = await AdminOptionStorage.findOneById(adminInfo);

      if (clubAdmin.id === payload.id) {
        return {
          success: true,
          msg: '권한 있음',
        };
      }
      return {
        success: false,
        msg: '동아리 관리 페이지에 접근 권한이 없습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  // 모든 동아리원과 회장.
  async findOneByClubNum() {
    const { clubNum } = this.params;

    try {
      const { success, leader, memberAndAuthList } =
        await AdminOptionStorage.findOneByClubNum(clubNum);

      if (success) {
        return { success: true, leader, memberAndAuthList };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  // 회장 양도.
  async updateLeaderById() {
    const payload = this.auth;
    const { clubNum } = this.params;
    const { newLeader } = this.body;

    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(clubNum);

      if (leader === payload.id) {
        const leaderInfo = {
          clubNum,
          newLeader,
        };
        const isChangeLeader =
          await AdminOptionStorage.updateNewLeaderByClubNum(leaderInfo);

        if (isChangeLeader) {
          const isUpdate = await AdminOptionStorage.updateLeaderAdminOptionById(
            leaderInfo
          );

          if (isUpdate) {
            return { success: true, msg: '회장이 양도되었습니다.' };
          }
          return {
            success: false,
            msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
          };
        }
      }
      return {
        success: false,
        msg: '회장만 접근이 가능합니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  // 관리자 권한 변경.
  async updateAdminOptionById() {
    const payload = this.auth;
    const { clubNum } = this.params;
    const adminOption = this.body;

    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(clubNum);

      if (leader === payload.id) {
        const adminInfo = {
          clubNum,
          adminOption: adminOption.adminOptions,
        };
        const isUpdate = await AdminOptionStorage.updateAdminOptionById(
          adminInfo
        );

        if (isUpdate) {
          return { success: true, msg: '권한이 수정되었습니다.' };
        }
        return {
          success: false,
          msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
        };
      }
      return { success: false, msg: '회장만 접근이 가능합니다.' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = AdminOption;

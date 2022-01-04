'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
const ApplicationStorage = require('../Application/ApplicationStorage');
const Error = require('../../utils/Error');

class AdminOption {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async checkClubAdmin() {
    const user = this.auth;

    try {
      const adminInfo = {
        id: user.id,
        clubNum: Number(this.params.clubNum),
      };

      const clubAdminId = await AdminOptionStorage.findOneById(adminInfo);

      if (clubAdminId === adminInfo.id || user.isAdmin === 1) {
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

  async findOneByClubNum() {
    const clubNum = Number(this.params.clubNum);

    try {
      const { success, leader, clubName, memberAndAuthList } =
        await AdminOptionStorage.findOneByClubNum(clubNum);

      if (success) {
        return {
          success: true,
          msg: '동아리원 정보 조회 성공',
          leader,
          clubName,
          memberAndAuthList,
        };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async updateLeaderById() {
    const user = this.auth;
    const clubNum = Number(this.params.clubNum);
    const { newLeader } = this.body;

    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(clubNum);

      if (leader === user.id) {
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

  async updateAdminOptionById() {
    const user = this.auth;
    const clubNum = Number(this.params.clubNum);
    const adminOption = this.body;

    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(clubNum);

      if (leader === user.id) {
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

  async createMemberById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicant: this.body.applicant,
      };

      const isUpdate = await ApplicationStorage.updateAcceptedApplicantById(
        applicantInfo
      );

      const isCreate = await ApplicationStorage.createMemberById(applicantInfo);

      if (isUpdate && isCreate) {
        return { success: true, msg: '동아리 가입 신청을 승인하셨습니다.' };
      }
      return {
        success: false,
        msg: '존재하지 않는 회원이거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async updateApplicantById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicantId: this.body.applicant,
      };
      const isUpdate = await ApplicationStorage.updateRejectedApplicantById(
        applicantInfo
      );

      if (isUpdate) {
        return { success: true, msg: '동아리 가입 신청을 거절하셨습니다.' };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async deleteMemberById() {
    const user = this.auth;
    const clubNum = Number(this.params.clubNum);
    const { memberId } = this.params;

    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(clubNum);

      if (leader === user.id) {
        const memberInfo = {
          clubNum,
          memberId,
        };

        const isDelete = await AdminOptionStorage.deleteMemberById(memberInfo);

        const isUpdate = await AdminOptionStorage.updateReadingFlagById(
          memberInfo
        );

        if (isDelete && isUpdate) {
          return { success: true, msg: `${memberId}님이 추방되었습니다.` };
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

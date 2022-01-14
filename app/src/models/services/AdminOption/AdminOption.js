'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
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
      const clubAdminInfo = {
        id: user.id,
        clubNum: this.params.clubNum,
      };

      const clubAdminId = await AdminOptionStorage.findOneById(clubAdminInfo);

      if (clubAdminId || user.isAdmin) {
        return {
          status: 200,
          success: true,
          msg: '권한 있음',
        };
      }
      return {
        status: 403,
        success: false,
        msg: '동아리 관리 페이지에 접근 권한이 없습니다.',
      };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async checkLeader() {
    const leader = await AdminOptionStorage.findLeaderByClubNum(
      this.params.clubNum
    );

    if (leader !== this.auth.id) {
      return {
        status: 400,
        success: false,
        msg: '회장만 접근이 가능합니다.',
      };
    }
    return { success: true };
  }

  async findOneByClubNum() {
    const { clubNum } = this.params;

    try {
      const memberAndAuthList =
        await AdminOptionStorage.findMemberAndAuthByClubNum(clubNum);

      const { leader, clubName } =
        await AdminOptionStorage.findClubInfoByClubNum(clubNum);

      return {
        success: true,
        msg: '동아리원 정보 조회 성공',
        leader,
        clubName,
        memberAndAuthList,
      };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findApplicantsByClubNum() {
    const { clubNum } = this.params;

    try {
      const applicantInfo = await AdminOptionStorage.findApplicantInfoByClubNum(
        clubNum
      );

      const questionAnswerInfo =
        await AdminOptionStorage.findQuestionsAnswersByClubNum(clubNum);

      const applicants = await AdminOptionStorage.findApplicantsByClubNum(
        clubNum
      );

      const questionsAnswers = applicants.map((applicant) =>
        questionAnswerInfo.filter((qAndA) => applicant.id === qAndA.id)
      );

      return { success: true, applicantInfo, questionsAnswers };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateLeaderById() {
    try {
      const isLeader = await this.checkLeader();

      if (!isLeader.success) return isLeader;
      return await this.changeNewLeader();
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async changeNewLeader() {
    const leaderInfo = {
      clubNum: this.params.clubNum,
      newLeader: this.body.newLeader,
    };

    const isChangeLeader = await AdminOptionStorage.updateNewLeaderByClubNum(
      leaderInfo
    );

    const isUpdate = await AdminOptionStorage.updateLeaderAdminOptionById(
      leaderInfo
    );

    if (isChangeLeader && isUpdate) {
      return { status: 200, success: true, msg: '회장이 양도되었습니다.' };
    }
    return {
      status: 400,
      success: false,
      msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
    };
  }

  async updateAdminOptionById() {
    try {
      const isLeader = await this.checkLeader();

      if (!isLeader.success) return isLeader;
      return await this.changeAdminOption();
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async changeAdminOption() {
    const adminInfo = {
      clubNum: this.params.clubNum,
      adminOption: this.body.adminOptions,
    };

    const isUpdate = await AdminOptionStorage.updateAdminOptionById(adminInfo);

    if (isUpdate) {
      return { status: 200, success: true, msg: '권한이 수정되었습니다.' };
    }
    return {
      status: 400,
      success: false,
      msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
    };
  }

  async createMemberById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicant: this.body.applicant,
      };

      const isUpdate = await AdminOptionStorage.updateAcceptedApplicantById(
        applicantInfo
      );

      const isCreate = await AdminOptionStorage.createMemberById(applicantInfo);

      if (isUpdate && isCreate) {
        return {
          status: 201,
          success: true,
          msg: '동아리 가입 신청을 승인하셨습니다.',
        };
      }
      return {
        status: 400,
        success: false,
        msg: '존재하지 않는 회원이거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateRejectedApplicantById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicantId: this.body.applicant,
      };

      const isUpdate = await AdminOptionStorage.updateRejectedApplicantById(
        applicantInfo
      );

      if (isUpdate) {
        return {
          status: 200,
          success: true,
          msg: '동아리 가입 신청을 거절했습니다.',
        };
      }
      return {
        status: 400,
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteMemberById() {
    try {
      const isLeader = await this.checkLeader();

      if (!isLeader.success) return isLeader;
      return await this.banishMemberById();
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async banishMemberById() {
    const { memberId } = this.params;

    const memberInfo = {
      clubNum: this.params.clubNum,
      memberId,
    };

    const isDelete = await AdminOptionStorage.deleteMemberById(memberInfo);

    const isUpdate = await AdminOptionStorage.updateReadingFlagById(memberInfo);

    if (isDelete && isUpdate) {
      return {
        status: 200,
        success: true,
        msg: `${memberId}님이 추방되었습니다.`,
      };
    }
    return {
      status: 400,
      success: false,
      msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
    };
  }
}

module.exports = AdminOption;

'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
const Error = require('../../utils/Error');
const makeResponse = require('../../utils/makeResponse');

class AdminOption {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async checkLeaderAdmin() {
    try {
      const leader = await AdminOptionStorage.findLeaderByClubNum(
        this.params.clubNum
      );

      if (leader !== this.auth.id) {
        return makeResponse(400, '회장만 접근이 가능합니다.');
      }
      return makeResponse(200, '권한 있음');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async checkClubAdmin() {
    const user = this.auth;
    const clubAdminInfo = {
      id: user.id,
      clubNum: this.params.clubNum,
    };

    try {
      const clubAdminId = await AdminOptionStorage.findOneById(clubAdminInfo);

      if (clubAdminId || user.isAdmin) return makeResponse(200, '권한 있음');
      return makeResponse(403, '동아리 관리 페이지에 접근 권한이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
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

      const questionsAnswers = applicants.map((applicant) => {
        return questionAnswerInfo.filter((qAndA) => applicant.id === qAndA.id);
      });

      return { success: true, applicantInfo, questionsAnswers };
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateLeaderById() {
    const leaderInfo = {
      clubNum: this.params.clubNum,
      newLeader: this.body.newLeader,
    };

    try {
      const isChangeLeader = await AdminOptionStorage.updateNewLeaderByClubNum(
        leaderInfo
      );

      const isUpdate = await AdminOptionStorage.updateLeaderAdminOptionById(
        leaderInfo
      );

      if (isChangeLeader && isUpdate) {
        return makeResponse(200, '회장이 양도되었습니다.');
      }
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateAdminOptionById() {
    const adminInfo = {
      clubNum: this.params.clubNum,
      adminOption: this.body.adminOptions,
    };

    try {
      const isUpdate = await AdminOptionStorage.updateAdminOptionById(
        adminInfo
      );

      if (isUpdate) return makeResponse(200, '권한이 수정되었습니다.');
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createMemberById() {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      applicant: this.body.applicant,
    };

    try {
      const isUpdate = await AdminOptionStorage.updateAcceptedApplicantById(
        applicantInfo
      );

      const isCreate = await AdminOptionStorage.createMemberById(applicantInfo);

      if (isUpdate && isCreate) {
        return makeResponse(201, '동아리 가입 신청을 승인하셨습니다.');
      }
      return makeResponse(
        400,
        '존재하지 않는 회원이거나 알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateRejectedApplicantById() {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      applicantId: this.body.applicant,
    };

    try {
      const isUpdate = await AdminOptionStorage.updateRejectedApplicantById(
        applicantInfo
      );

      if (isUpdate) {
        return makeResponse(200, '동아리 가입 신청을 거절했습니다.');
      }
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteMemberById() {
    const { memberId } = this.params;

    const memberInfo = {
      clubNum: this.params.clubNum,
      memberId,
    };

    try {
      const isDelete = await AdminOptionStorage.deleteMemberById(memberInfo);

      const isUpdate = await AdminOptionStorage.updateReadingFlagById(
        memberInfo
      );

      if (isDelete && isUpdate) {
        return makeResponse(200, `${memberId}님이 추방되었습니다.`);
      }
      return makeResponse(
        400,
        '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = AdminOption;

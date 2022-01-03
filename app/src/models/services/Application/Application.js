'use strict';

const ApplicationStorage = require('./ApplicationStorage');
const StudentStorage = require('../Student/StudentStorage');
const Notification = require('../Notification/Notification');
const NotificationStorage = require('../Notification/NotificationStorage');
const Error = require('../../utils/Error');

class Application {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findAllByClubNum() {
    const { id } = this.auth;
    const { clubNum } = this.params;

    try {
      const clubInfo = {
        id,
        clubNum,
      };
      const result = await ApplicationStorage.findAllByClubNum(clubInfo);

      if (result.success) {
        return {
          success: true,
          msg: '동아리 가입 신청서 조회 성공',
          clientInfo: result.clientInfo,
          leader: result.clubLeader[0].leader,
          questions: result.questions,
        };
      }
      return { success: false, msg: '존재하지 않는 동아리입니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createQuestion() {
    const { clubNum } = this.params;
    const { description } = this.body;

    try {
      const questionInfo = {
        clubNum,
        description,
      };
      const success = await ApplicationStorage.createQuestion(questionInfo);

      if (success) return { success: true, msg: '질문 등록에 성공하셨습니다.' };
      return { success: false, msg: '질문 등록에 실패하셨습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateQuestion() {
    const data = this.body;
    const { params } = this;

    try {
      const questionInfo = {
        no: params.questionNo,
        description: data.description,
      };

      const waitingApplicant = await ApplicationStorage.findWaitingApplicants(
        params.clubNum
      );

      if (waitingApplicant) {
        return {
          success: false,
          msg: '가입 신청 대기자가 있으므로 질문을 변경하실 수 없습니다.',
        };
      }

      const success = await ApplicationStorage.updateQuestion(questionInfo);

      if (success) return { success: true, msg: '질문 수정에 성공하셨습니다.' };
      return { success: false, msg: '질문 수정에 실패하셨습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteQuestion() {
    const { params } = this;

    try {
      const waitingApplicant = await ApplicationStorage.findWaitingApplicants(
        params.clubNum
      );

      if (waitingApplicant) {
        return {
          success: false,
          msg: '가입 신청 대기자가 있으므로 질문을 삭제하실 수 없습니다.',
        };
      }

      const success = await ApplicationStorage.deleteQuestion(
        params.questionNo
      );

      if (success) return { success: true, msg: '질문 삭제에 성공하셨습니다.' };
      return { success: false, msg: '질문 삭제에 실패하셨습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createAnswer() {
    const { clubNum } = this.params;
    const { auth } = this;
    const answer = this.body;
    const notification = new Notification(this.req);

    try {
      const applicantInfo = {
        clubNum,
        id: auth.id,
      };

      // 중복 가입 신청 방지 (승인 전 OR 멤버)
      const isApplicant = await ApplicationStorage.findApplicant(applicantInfo);

      if (isApplicant !== undefined && isApplicant.readingFlag !== 2) {
        const msg = isApplicant.readingFlag
          ? '이미 가입된 동아리입니다.'
          : '가입 승인 대기중입니다.';

        return { success: false, msg };
      }

      // 멤버 x , 중복 가입 신청 x
      const answerInfo = {
        id: auth.id,
        name: auth.name,
        grade: answer.basic.grade,
        gender: answer.basic.gender,
        phoneNum: answer.basic.phoneNum,
        extra: answer.extra,
      };

      if (!(answerInfo.grade && answerInfo.gender && answerInfo.phoneNum)) {
        return { success: false, msg: '필수 답변을 전부 기입해주세요.' };
      }

      const phoneNumberRegExp = /^[0-9]+$/;

      if (
        answerInfo.phoneNum.length !== 11 ||
        !answerInfo.phoneNum.match(phoneNumberRegExp)
      ) {
        return { success: false, msg: '전화번호 형식이 맞지 않습니다.' };
      }

      const isPhoneNum = await StudentStorage.findOneByPhoneNum(
        answerInfo.phoneNum,
        auth.id
      );

      if (isPhoneNum) {
        return { success: false, msg: '다른 유저가 사용중인 번호입니다.' };
      }

      const isBasic = await ApplicationStorage.createBasicAnswer(answerInfo);

      // 필수 질문 추가 완 x
      if (!isBasic) {
        return { success: false, msg: '필수 답변이 작성되지 않았습니다.' };
      }

      // 필수 질문 추가 완 / 추가 질문 여부
      if (answerInfo.extra.length) {
        // 추가 질문이 있을 시
        // 첫 가입 신청 시 아닐 때
        if (isApplicant) {
          const extraQuestionNums = [];

          answerInfo.extra.forEach((x) => {
            extraQuestionNums.push(x.no);
          });

          await ApplicationStorage.deleteExtraAnswer(
            extraQuestionNums,
            auth.id
          );
        }
        const isExtra = await ApplicationStorage.createExtraAnswer(answerInfo);

        if (isExtra !== answerInfo.extra.length) {
          return { success: false, msg: '추가 답변이 작성되지 않았습니다.' };
        }
      }
      // 질문 추가 완 => 동아리 지원자 테이블 추가
      const result = await ApplicationStorage.createApplicant(applicantInfo);

      if (result) {
        const { clubName, leaderName, leaderId } =
          await NotificationStorage.findClubInfoByClubNum(
            applicantInfo.clubNum
          );

        const notificationInfo = {
          clubName,
          senderName: auth.name,
          recipientName: leaderName,
          recipientId: leaderId,
          content: '동아리 가입 신청 완료',
        };

        await notification.createNotification(notificationInfo);

        return { success: true, msg: '가입 신청이 완료 되었습니다.' };
      }
      return { success: false, msg: '가입 신청이 완료되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findOneByClubNum() {
    const { clubNum } = this.params;

    try {
      const { success, applicantInfo, questionsAnswers } =
        await ApplicationStorage.findOneByClubNum(clubNum);

      if (success) {
        return { success: true, applicantInfo, questionsAnswers };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async createMemberById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicant: this.body.applicant,
        type: '승인',
      };

      const isUpdate = await ApplicationStorage.updateAcceptedApplicantById(
        applicantInfo
      );

      const isCreate = await ApplicationStorage.createMemberById(applicantInfo);

      if (isUpdate && isCreate) {
        await this.sendNotification(applicantInfo.type);

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

  async sendNotification(resultType) {
    const notificationInfo = await this.getNotificationInfo(resultType);

    if (resultType === '승인') {
      await this.sendApproveNotification(notificationInfo);
    }

    if (resultType === '거절') await this.createNotification(notificationInfo);
  }

  async getNotificationInfo(resultType) {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      applicantId: this.body.applicant,
    };

    const { clubName } = await NotificationStorage.findClubInfoByClubNum(
      applicantInfo.clubNum
    );

    const applicantName =
      await ApplicationStorage.findOneByApplicantIdAndClubNum(applicantInfo);

    const notificationInfo = {
      title: clubName,
      senderName: this.auth.name,
    };

    if (resultType === '거절') {
      notificationInfo.recipientName = applicantName;
      notificationInfo.recipientId = applicantInfo.applicantId;
      notificationInfo.content = '동아리 가입 신청 결과';
    }

    if (resultType === '승인') {
      const recipients = await NotificationStorage.findAllByClubNum(
        applicantInfo.clubNum
      );

      notificationInfo.content = `${applicantName}님 가입`;
      notificationInfo.recipients = recipients;
    }

    return notificationInfo;
  }

  async sendApproveNotification(notificationInfo) {
    notificationInfo.recipients.forEach(async (recipient) => {
      if (this.auth.id !== recipient.id) {
        notificationInfo.recipientName = recipient.name;
        notificationInfo.recipientId = recipient.id;

        if (recipient.id === this.body.applicant) {
          notificationInfo.content = '동아리 가입을 축하합니다.🎊';
        }
        await this.createNotification(notificationInfo);
      }
    });
  }

  createNotification(notificationInfo) {
    return new Notification(this.req).createNotification(notificationInfo);
  }

  async updateApplicantById() {
    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicantId: this.body.applicant,
        type: '거절',
      };
      const isUpdate = await ApplicationStorage.updateRejectedApplicantById(
        applicantInfo
      );

      if (isUpdate) {
        await this.sendNotification(applicantInfo.type);

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
}

module.exports = Application;

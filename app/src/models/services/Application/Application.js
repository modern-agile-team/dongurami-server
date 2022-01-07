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

  static makeMsg(status, msg, result) {
    return {
      status,
      success: status < 400,
      msg,
      result,
    };
  }

  async findOneLeader() {
    const leaderInfo = await ApplicationStorage.findOneLeader(
      this.params.clubNum
    );

    return leaderInfo;
  }

  async findOneClient(leaderId) {
    const clientId = this.auth.id;
    const clientInfo = await ApplicationStorage.findOneClient(clientId);

    clientInfo.leaderFlag = leaderId === clientId;

    return clientInfo;
  }

  async findAllQuestions() {
    const questions = await ApplicationStorage.findAllQuestions(
      this.params.clubNum
    );

    return questions;
  }

  async findAllByClubNum() {
    try {
      const leaderInfo = await this.findOneLeader();

      if (leaderInfo) {
        const clientInfo = await this.findOneClient(leaderInfo.leader);
        const questions = await this.findAllQuestions();

        return Application.makeMsg(200, '동아리 가입 신청서 조회 성공', {
          clientInfo,
          questions,
        });
      }
      return Application.makeMsg(404, '존재하지 않는 동아리입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createQuestion() {
    try {
      const questionInfo = {
        clubNum: this.params.clubNum,
        description: this.body.description,
      };

      const leaderInfo = await this.findOneLeader();

      if (leaderInfo.leader === this.auth.id) {
        const success = await ApplicationStorage.createQuestion(questionInfo);

        if (success) return Application.makeMsg(201, '질문이 등록되었습니다.');
        return Application.makeMsg(400, '질문이 등록되지 않았습니다.');
      }
      return Application.makeMsg(403, '질문 등록 권한이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findOneWaitingApplicant() {
    const waitingApplicant = await ApplicationStorage.findOneWaitingApplicant(
      this.params.clubNum
    );

    return waitingApplicant;
  }

  async updateQuestion() {
    try {
      const leaderInfo = await this.findOneLeader();

      if (leaderInfo.leader === this.auth.id) {
        const waitingApplicant = await this.findOneWaitingApplicant();

        if (waitingApplicant) {
          return Application.makeMsg(
            400,
            '가입 신청 대기자가 있으므로 질문을 변경할 수 없습니다.'
          );
        }

        const questionInfo = {
          no: this.params.questionNo,
          description: this.body.description,
        };
        const success = await ApplicationStorage.updateQuestion(questionInfo);

        if (success) return Application.makeMsg(200, '질문이 수정되었습니다.');
        return Application.makeMsg(400, '질문이 수정되지 않았습니다.');
      }
      return Application.makeMsg(403, '질문 수정 권한이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteQuestion() {
    try {
      const leaderInfo = await this.findOneLeader();

      if (leaderInfo.leader === this.auth.id) {
        const waitingApplicant = await this.findOneWaitingApplicant();

        if (waitingApplicant) {
          return Application.makeMsg(
            400,
            '가입 신청 대기자가 있으므로 질문을 삭제할 수 없습니다.'
          );
        }

        const success = await ApplicationStorage.deleteQuestion(
          this.params.questionNo
        );

        if (success) return Application.makeMsg(200, '질문이 삭제되었습니다.');
        return Application.makeMsg(400, '질문이 삭제되지 않았습니다.');
      }
      return Application.makeMsg(403, '질문 삭제 권한이 없습니다.');
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
    const user = this.auth;
    const notification = new Notification(this.req);

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
        const { clubName } = await NotificationStorage.findClubInfoByClubNum(
          applicantInfo.clubNum
        );

        const recipients = await NotificationStorage.findAllByClubNum(
          applicantInfo.clubNum
        );

        const recipientName =
          await ApplicationStorage.findOneByApplicantIdAndClubNum(
            applicantInfo
          );

        recipients.forEach(async (recipient) => {
          if (user.id !== recipient.id) {
            const notificationInfo = {
              clubName,
              senderName: user.name,
              recipientName: recipient.name,
              recipientId: recipient.id,
              content: `${recipientName}님 가입`,
            };

            if (recipient.id === applicantInfo.applicant) {
              notificationInfo.content = '동아리 가입을 축하합니다.🎊';
            }
            await notification.createNotification(notificationInfo);
          }
        });
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
    const notification = new Notification(this.req);

    try {
      const applicantInfo = {
        clubNum: this.params.clubNum,
        applicant: this.body.applicant,
      };
      const isUpdate = await ApplicationStorage.updateRejectedApplicantById(
        applicantInfo
      );

      if (isUpdate) {
        const senderName = this.auth.name;

        const { clubName } = await NotificationStorage.findClubInfoByClubNum(
          applicantInfo.clubNum
        );

        const applicantName =
          await ApplicationStorage.findOneByApplicantIdAndClubNum(
            applicantInfo
          );

        const notificationInfo = {
          clubName,
          senderName,
          recipientName: applicantName,
          recipientId: applicantInfo.applicant,
          content: '동아리 가입 신청 결과',
        };

        await notification.createNotification(notificationInfo);

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

'use strict';

const ApplicationStorage = require('./ApplicationStorage');
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
        if (await this.findOneWaitingApplicant()) {
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
        if (await this.findOneWaitingApplicant()) {
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

  async checkApplicantRecord() {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      id: this.auth.id,
    };
    const applicant = await ApplicationStorage.checkApplicantRecord(
      applicantInfo
    );

    return applicant;
  }

  async createBasicAnswer() {
    const basicAnswer = this.body.basic;

    if (!(basicAnswer.grade && basicAnswer.gender && basicAnswer.phoneNum)) {
      return Application.makeMsg(400, '필수 답변을 전부 기입해주세요.');
    }

    const phoneNumCheck = await this.phoneNumCheck(basicAnswer.phoneNum);

    if (!phoneNumCheck.success) return phoneNumCheck;

    const basicAnswerInfo = {
      id: this.auth.id,
      grade: basicAnswer.grade,
      gender: basicAnswer.gender,
      phoneNum: basicAnswer.phoneNum,
    };

    const createBasicAnswer = await ApplicationStorage.createBasicAnswer(
      basicAnswerInfo
    );

    return createBasicAnswer
      ? { success: true }
      : Application.makeMsg(400, '필수 답변이 작성되지 않았습니다.');
  }

  async phoneNumCheck(phoneNum) {
    const PHONE_NUMBER_REGEXP = /^[0-9]+$/;

    if (phoneNum.length !== 11 || !phoneNum.match(PHONE_NUMBER_REGEXP)) {
      return Application.makeMsg(400, '전화번호 형식이 맞지 않습니다.');
    }

    const phoneNumInfo = {
      phoneNum,
      id: this.auth.id,
    };
    const duplicatePhoneNum = await ApplicationStorage.findDuplicatePhoneNum(
      phoneNumInfo
    );

    if (duplicatePhoneNum) {
      return Application.makeMsg(409, '다른 유저가 사용중인 번호입니다.');
    }
    return { success: true };
  }

  async deleteExtraAnswer(extraAnswer) {
    const extraQuestionNums = [];

    extraAnswer.forEach((x) => {
      extraQuestionNums.push(x.no);
    });

    const extraAnswerInfo = {
      extraQuestionNums,
      id: this.auth.id,
    };

    await ApplicationStorage.deleteExtraAnswer(extraAnswerInfo);
  }

  async createExtraAnswer() {
    const answerInfo = {
      extraAnswers: this.body.extra,
      id: this.auth.id,
    };

    const createExtraAnswer = await ApplicationStorage.createExtraAnswer(
      answerInfo
    );

    return createExtraAnswer;
  }

  async createApplicant() {
    const applicantInfo = {
      clubNum: this.params.clubNum,
      id: this.auth.id,
    };

    const applicant = await ApplicationStorage.createApplicant(applicantInfo);

    return applicant;
  }

  async createAnswer() {
    try {
      if ((await this.findOneLeader()).leader === this.auth.id) {
        return Application.makeMsg(400, '이미 가입된 동아리입니다.');
      }

      const applicant = await this.checkApplicantRecord();

      if (applicant !== undefined && applicant.readingFlag !== 2) {
        const msg = applicant.readingFlag
          ? '이미 가입된 동아리입니다.'
          : '가입 승인 대기중입니다.';

        return Application.makeMsg(400, msg);
      }

      const createBasicAnswer = await this.createBasicAnswer();

      if (!createBasicAnswer.success) return createBasicAnswer;

      const extraAnswer = this.body.extra;

      if (extraAnswer.length) {
        if (applicant) await this.deleteExtraAnswer(extraAnswer);

        const createExtraAnswer = await this.createExtraAnswer();

        if (createExtraAnswer !== extraAnswer.length) {
          return Application.makeMsg(400, '추가 답변이 작성되지 않았습니다.');
        }
      }

      await this.createApplicant();
      return Application.makeMsg(200, '가입 신청이 완료되었습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Application;

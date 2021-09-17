'use strict';

const ApplicationStorage = require('./ApplicationStorage');
const Error = require('../../utils/Error');

class Application {
  constructor(req) {
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
          clientInfo: result.clientInfo,
          leader: result.clubLeader[0].leader,
          questions: result.questions,
        };
      }
      return false;
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

      if (success) return { success: true };
      return { success: false };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateQuestion() {
    const data = this.body;
    const { no } = this.params;

    try {
      const questionInfo = {
        no,
        description: data.description,
      };
      const success = await ApplicationStorage.updateQuestion(questionInfo);

      if (success) return { success: true };
      return { success: false };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteQuestion() {
    const { no } = this.params;

    try {
      const success = await ApplicationStorage.deleteQuestion(no);

      if (success) return { success: true };
      return { success: false };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createAnswer() {
    const { clubNum } = this.params;
    const { auth } = this;
    const answer = this.body;

    try {
      const applicantInfo = {
        clubNum,
        id: auth.id,
      };
      const isMember = await ApplicationStorage.findMember(applicantInfo);

      // 멤버 o
      if (isMember === false)
        return { success: false, msg: '가입된 동아리입니다.' };

      // 멤버 x
      const answerInfo = {
        id: auth.id,
        name: auth.name,
        grade: answer.basic.grade,
        gender: answer.basic.gender,
        phoneNum: answer.basic.phoneNum,
        extra: answer.extra,
      };
      const isBasic = await ApplicationStorage.createBasicAnswer(answerInfo);

      // 필수 질문 추가 완 x
      if (isBasic === 0)
        return { success: true, msg: '필수 질문이 작성되지않았습니다.' };

      // 필수 질문 추가 완 / 추가 질문 여부
      if (answerInfo.extra.length !== 0) {
        // 추가 질문이 있을 시
        const isExtra = await ApplicationStorage.createExtraAnser(answerInfo);

        if (isExtra === false)
          return { success: false, msg: '추가 질문이 작성되지 않았습니다.' };
      }
      // 질문 추가 완 => 동아리 지원자 테이블 추가
      const result = await ApplicationStorage.createApplicant(applicantInfo);

      if (result === 1)
        return { success: true, msg: '가입 신청이 완료 되었습니다.' };
      return { success: false, msg: '가입 신청이 완료되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Application;

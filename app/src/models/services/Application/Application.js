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

      await ApplicationStorage.createQuestion(questionInfo);

      return { success: true };
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
      await ApplicationStorage.updateQuestion(questionInfo);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteQuestion() {
    const { no } = this.params;

    try {
      await ApplicationStorage.deleteQuestion(no);

      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createAnswer() {
    const { clubNum } = this.params;
    const { auth } = this;
    const { basic } = this.body;
    const { extra } = this.body;

    try {
      const answerInfo = {
        id: auth.id,
        name: auth.name,
        grade: basic.grade,
        gender: basic.gender,
        phoneNum: basic.phoneNum,
        extra,
      };
      await ApplicationStorage.createAnswer(answerInfo);

      const applicantInfo = {
        clubNum,
        id: auth.id,
      };

      await ApplicationStorage.createApplicant(applicantInfo);
      return { success: true };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Application;

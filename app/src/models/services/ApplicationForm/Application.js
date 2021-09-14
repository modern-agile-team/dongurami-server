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
    const { clubNum } = this.params;
    try {
      const result = await ApplicationStorage.findAllByClubNum(clubNum);

      if (result.success) {
        return {
          success: true,
          leader: result.clubLeader[0].leader,
          questions: result.questions,
        };
      }
      return { success: result.success, msg: result.msg };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createQuestion() {
    const { clubNum } = this.params;
    const { questions } = this.body;

    try {
      const questionInfo = {
        clubNum,
        questions,
      };
      const result = await ApplicationStorage.createQuestion(questionInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateQuestion() {
    const data = this.body;

    try {
      const questionInfo = {
        no: data.no,
        description: data.description,
      };
      const result = await ApplicationStorage.updateQuestion(questionInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteQuestion() {
    const { no } = this.body;

    try {
      const result = await ApplicationStorage.deleteQuestion(no);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Application;

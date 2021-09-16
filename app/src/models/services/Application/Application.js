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

      const result = await ApplicationStorage.createQuestion(questionInfo);

      return { success: result };
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
      const result = await ApplicationStorage.updateQuestion(questionInfo);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteQuestion() {
    const { no } = this.params;

    try {
      const result = await ApplicationStorage.deleteQuestion(no);

      return { success: result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  // 관리자 페이지에 보여지는 신청서
  async findOneByClubNum() {
    const clubNum = Number(this.params.clubNum);

    try {
      const { success, applicantInfo, questionAndAnswer } =
        await ApplicationStorage.findOneByClubNum(clubNum);

      if (success) {
        return { success: true, applicantInfo, questionAndAnswer };
      }
      return {
        success: false,
        msg: '알 수 없는 에러입니다. 서버 개발자에게 문의해주세요.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  // async updateById() {
  //   const
  // }
}

module.exports = Application;

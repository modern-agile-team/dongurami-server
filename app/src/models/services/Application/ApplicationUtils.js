'use strict';

const ApplicationStorage = require('./ApplicationStorage');

class Applicationutil {
  static makeMsg(status, msg, result) {
    return {
      status,
      success: status < 400,
      msg,
      result,
    };
  }

  static checkPhoneNumFormat(phoneNum) {
    const PHONE_NUMBER_REGEXP = /^[0-9]/;

    return !!(phoneNum.length !== 11 || !PHONE_NUMBER_REGEXP.test(phoneNum));
  }

  static extractQuestionNums(extraAnswers) {
    const extraQuestionNums = extraAnswers.map((extraAnswer) => {
      return extraAnswer.no;
    });

    return extraQuestionNums;
  }

  static async findOneClient(ids) {
    const clientInfo = await ApplicationStorage.findOneClient(ids.clientId);

    clientInfo.leaderFlag = ids.leaderId === ids.clientId;

    return clientInfo;
  }

  static async createBasicAnswer(basicAnswer, clientId) {
    const basicAnswerInfo = {
      clientId,
      grade: basicAnswer.grade,
      gender: basicAnswer.gender,
      phoneNum: basicAnswer.phoneNum,
    };

    const isCreate = await ApplicationStorage.createBasicAnswer(
      basicAnswerInfo
    );

    return !!isCreate;
  }
}

module.exports = Applicationutil;

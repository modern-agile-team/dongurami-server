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

  static nullCheckBasicAnswer(basicAnswer) {
    return !!(basicAnswer.grade && basicAnswer.gender && basicAnswer.phoneNum);
  }

  static checkPhoneNumFormat(phoneNum) {
    const PHONE_NUMBER_REGEXP = /^[0-9]/;

    return !!(phoneNum.length !== 11 || !PHONE_NUMBER_REGEXP.test(phoneNum));
  }

  static async findOneClient(ids) {
    const clientInfo = await ApplicationStorage.findOneClient(ids.clientId);

    clientInfo.leaderFlag = ids.leaderId === ids.clientId;

    return clientInfo;
  }

  static async checkApplicantRecord(clientId, clubNum) {
    const applicantInfo = {
      clientId,
      clubNum,
    };
    const applicant = await ApplicationStorage.checkApplicantRecord(
      applicantInfo
    );

    return applicant;
  }

  static async checkDuplicatePhoneNum(phoneNum, clientId) {
    const phoneNumInfo = {
      phoneNum,
      clientId,
    };
    const duplicatePhoneNum = await ApplicationStorage.findDuplicatePhoneNum(
      phoneNumInfo
    );

    return !!duplicatePhoneNum;
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

  static async deleteExtraAnswer(extraAnswers, clientId) {
    const extraQuestionNums = extraAnswers.map((extraAnswer) => {
      return extraAnswer.no;
    });

    const extraAnswerInfo = {
      extraQuestionNums,
      clientId,
    };

    await ApplicationStorage.deleteExtraAnswer(extraAnswerInfo);
  }

  static async createExtraAnswer(extraAnswers, clientId) {
    const answerInfo = {
      extraAnswers,
      clientId,
    };

    const createExtraAnswer = await ApplicationStorage.createExtraAnswer(
      answerInfo
    );

    return createExtraAnswer;
  }

  static async createApplicant(clubNum, clientId) {
    const applicantInfo = {
      clubNum,
      clientId,
    };

    const applicant = await ApplicationStorage.createApplicant(applicantInfo);

    return applicant;
  }
}

module.exports = Applicationutil;

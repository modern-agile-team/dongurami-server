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

  static async findOneLeader(clubNum) {
    const leaderInfo = await ApplicationStorage.findOneLeader(clubNum);

    return leaderInfo;
  }

  static async findOneClient(ids) {
    const clientInfo = await ApplicationStorage.findOneClient(ids.clientId);

    clientInfo.leaderFlag = ids.leaderId === ids.clientId;

    return clientInfo;
  }

  static async findAllQuestions(clubNum) {
    const questions = await ApplicationStorage.findAllQuestions(clubNum);

    return questions;
  }

  static async findOneWaitingApplicant(clubNum) {
    const waitingApplicant = await ApplicationStorage.findOneWaitingApplicant(
      clubNum
    );

    return waitingApplicant;
  }
}

module.exports = Applicationutil;

'use strict';

const LetterStorage = require('./LetterStorage');

class LetterUtil {
  static makeResponse(status, msg, letters) {
    return {
      status,
      success: status < 400,
      msg,
      letters,
    };
  }

  static anonymization(letters) {
    letters.forEach((letter) => {
      if (letter.hiddenFlag) letter.name = '익명';
    });
  }

  static addUrl(letters) {
    letters.forEach((letter) => {
      letter.url = `message?id=${letter.groupNo}`;
    });
  }

  static divideId(participantInfo, id) {
    participantInfo.id = id;
    participantInfo.otherId =
      participantInfo.senderId === id
        ? participantInfo.recipientId
        : participantInfo.senderId;
  }

  static changeAnonymous(letters, id) {
    if (letters[0].otherHiddenFlag) {
      letters.forEach((letter) => {
        letter.name = '익명';
        if (letter.senderId !== id) {
          letter.senderId = '익명';
        } else {
          letter.recipientId = '익명';
        }
      });
    }

    if (letters[0].myHiddenFlag) {
      letters.forEach((letter) => {
        if (letter.senderId !== id) {
          letter.recipient = '익명';
        } else {
          letter.senderId = '익명';
        }
      });
    }
  }

  static changeGroupNo(senderInsertNo, checkGroupNo) {
    return checkGroupNo[0] ? checkGroupNo[0].groupNo : senderInsertNo;
  }

  static async findRecipientId(data) {
    data.recipientId = data.boardFlag
      ? await LetterStorage.findRecipientByBoard(data.boardNo)
      : await LetterStorage.findRecipientByComment(data.commentNo);
  }
}

module.exports = LetterUtil;

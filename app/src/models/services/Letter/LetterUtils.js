'use strict';

class LetterUtil {
  static checkHiddenFlagForNoti(letters) {
    letters.forEach((letter) => {
      if (letter.hiddenFlag) {
        letter.name = '익명';
      }
      letter.url = `message?id=${letter.groupNo}`;
    });
  }

  static checkHiddenFlag(letters) {
    letters.forEach((letter) => {
      if (letter.hiddenFlag) letter.name = '익명';
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
}

module.exports = LetterUtil;

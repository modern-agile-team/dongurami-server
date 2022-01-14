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
}

module.exports = LetterUtil;

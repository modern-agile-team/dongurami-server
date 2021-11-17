'use strict';

const LetterStorage = require('./LetterStorage');
const Error = require('../../utils/Error');

class Letter {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createLetter() {
    const data = this.body;

    try {
      if (!data.recipientId.length) {
        data.recipientId = data.boardFlag
          ? await LetterStorage.findRecipientByBoard(data.boardNo)
          : await LetterStorage.findRecipientByComment(
              data.boardNo,
              data.commentNo
            );
      }

      const sendInfo = {
        senderId: this.auth.id,
        recipientId: data.recipientId,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      const result = boardFlag
        ? await LetterStorage.createLetterByBoard(sendInfo)
        : await LetterStorage.createLetterByComment(sendInfo);

      if (result) return { success: true, msg: '쪽지가 전송되었습니다.' };
      return { success: false, msg: '쪽지가 전송되지 않았습니다.' };
    } catch {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Letter;

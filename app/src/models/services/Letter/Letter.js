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
        description: data.description,
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

  async findLetters() {
    const { id } = this.auth;

    try {
      if (this.params.id !== id) {
        return { success: false, msg: '본인만 열람가능합니다.' };
      }

      const letters = await LetterStorage.findLetters(id);

      if (letters) return { success: true, msg: '쪽지 전체 조회 성공' };
      return { success: true, msg: '쪽지가 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Letter;

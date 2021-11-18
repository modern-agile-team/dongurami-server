'use strict';

const LetterStorage = require('./LetterStorage');
const Error = require('../../utils/Error');

class Letter {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findLetters() {
    const { id } = this.auth;

    try {
      if (this.params.id !== id) {
        return { success: false, msg: '본인만 열람 가능합니다.' };
      }

      const letters = await LetterStorage.findLetters(id);

      if (letters) {
        return { success: true, msg: '쪽지 전체 조회 성공', letters };
      }
      return { success: true, msg: '쪽지가 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findLettersByGroup() {
    const { id } = this.auth;

    try {
      if (this.params.id !== id) {
        return { success: false, msg: '본인만 열람 가능합니다.' };
      }

      const letters = await LetterStorage.findLettersByGroup(id);

      if (letters) {
        return { success: true, msg: '쪽지 대화 목록 조회 성공', letters };
      }
      return { success: false, msg: '쪽지 대화 목록 조회 실패' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createLetter() {
    const data = this.body;

    try {
      // 수신자가 익명일 경우
      if (!data.recipientId.length) {
        data.recipientId = data.boardFlag
          ? await LetterStorage.findRecipientByBoard(data.boardNo) // 수신자 : 글 작성자
          : await LetterStorage.findRecipientByComment(
              data.boardNo,
              data.commentNo
            ); // 수신자 : 댓글 작성자
      }

      const sendInfo = {
        senderId: this.auth.id,
        recipientId: data.recipientId,
        description: data.description,
        boardFlag: data.boardFlag,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      const result = await LetterStorage.createLetter(sendInfo);

      if (result === 2) return { success: true, msg: '쪽지가 전송되었습니다.' };
      return { success: false, msg: '쪽지가 전송되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createReplyLetter() {
    const data = this.body;
    const { id } = this.auth;

    try {
      // 수신자가 익명일 경우 => 해당 쪽지의 수신자, 발신자의 학번과 auth.id를 비교하여 수신자 찾아주기
      if (!data.recipientId.length) {
        const recipientInfo = await LetterStorage.findRecipientByLetter(
          this.params.letterNo
        );

        data.recipientId =
          recipientInfo.senderId === id
            ? recipientInfo.recipientId
            : recipientInfo.senderId;
      }

      const sendInfo = {
        senderId: id,
        recipientId: data.recipientId,
        description: data.description,
        boardFlag: data.boardFlag,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      const result = await LetterStorage.createLetter(sendInfo);

      if (result === 2) return { success: true, msg: '쪽지가 전송되었습니다.' };
      return { success: false, msg: '쪽지가 전송되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteLetters() {
    const { id } = this.auth;
    const { letterNo } = this.params;

    try {
      const { boardFlag, boardNo } = await LetterStorage.findeLetterInfo(
        letterNo
      );

      const letterInfo = {
        id,
        boardFlag,
        boardNo,
      };

      const result = await LetterStorage.deleteLetters(letterInfo);

      if (result) {
        return { success: true, msg: '쪽지 대화 목록 전체 삭제 성공' };
      }
      return { success: false, msg: '쪽지 대화 목록 전체 삭제 실패' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = Letter;

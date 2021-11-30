'use strict';

const LetterStorage = require('./LetterStorage');
const Error = require('../../utils/Error');

class Letter {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findLetterNotifications() {
    const { id } = this.auth;

    try {
      const letters = await LetterStorage.findLetterNotifications(id);

      letters.forEach((letter) => {
        if (letter.writerHiddenFlag) {
          letter.name = '익명';
        }
        letter.url = `message?id=${letter.no}`;
      });

      return { success: true, msg: '쪽지 알람 전체 조회 성공', letters };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findLetters() {
    const { id } = this.auth;

    try {
      if (this.params.id !== id) {
        return { success: false, msg: '본인만 열람 가능합니다.' };
      }

      const letters = await LetterStorage.findLetters(id);

      letters.forEach((letter) => {
        if (letter.hiddenFlag) letter.name = '익명';
      });

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
    const { letterNo } = this.params;

    try {
      const isLetter = await LetterStorage.findLetterByNo(letterNo);

      if (!isLetter[0]) {
        return {
          success: false,
          msg: '존재하지 않는 쪽지입니다.',
          status: 404,
        };
      }
      if (this.params.id !== id) {
        return { success: false, msg: '본인만 열람 가능합니다.', status: 403 };
      }
      const letterInfo = await LetterStorage.findLetterInfo(letterNo);

      letterInfo.id = id;
      letterInfo.otherId =
        letterInfo.senderId === id
          ? letterInfo.recipientId
          : letterInfo.senderId;

      const reading = await LetterStorage.updateReadingFlag(letterInfo);

      console.log(letterInfo);
      if (reading) {
        const letters = await LetterStorage.findLettersByGroup(letterInfo);

        if (letters[0].writerHiddenFlag) {
          letters.forEach((letter) => {
            letter.name = '익명';
            if (letter.senderId !== id) {
              letter.senderId = '익명';
            }
          });
        }

        if (letters) {
          return { success: true, msg: '쪽지 대화 목록 조회 성공', letters };
        }
      }
      return { success: false, msg: '쪽지 대화 목록 조회 실패' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createLetter() {
    const data = this.body;

    try {
      let recipientHiddenFlag = 0;

      // 수신자가 익명일 경우
      if (!data.recipientId.length) {
        recipientHiddenFlag = 1;
        data.recipientId = data.boardFlag
          ? await LetterStorage.findRecipientByBoard(data.boardNo)
          : await LetterStorage.findRecipientByComment(
              data.boardNo,
              data.commentNo
            );
      }

      const sendInfo = {
        recipientHiddenFlag,
        senderId: this.auth.id,
        recipientId: data.recipientId,
        description: data.description,
        boardFlag: data.boardFlag,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      const { sender, recipient } = await LetterStorage.createLetter(sendInfo);

      const result = await LetterStorage.updateGroupNo(
        sender,
        recipient,
        sender
      );

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
      let recipientHiddenFlag = 0;
      // 수신자가 익명일 경우 => 해당 쪽지의 수신자, 발신자의 학번과 auth.id를 비교하여 수신자 찾아주기
      if (!data.recipientId.length) {
        recipientHiddenFlag = 1;
        const recipientInfo = await LetterStorage.findRecipientByLetter(
          this.params.letterNo
        );

        data.recipientId =
          recipientInfo.senderId === id
            ? recipientInfo.recipientId
            : recipientInfo.senderId;
      }

      const sendInfo = {
        recipientHiddenFlag,
        senderId: id,
        recipientId: data.recipientId,
        description: data.description,
        boardFlag: data.boardFlag,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      const { sender, recipient } = await LetterStorage.createLetter(sendInfo);

      const result = await LetterStorage.updateGroupNo(
        sender,
        recipient,
        data.groupNo
      );

      if (result === 2) return { success: true, msg: '쪽지가 전송되었습니다.' };
      return { success: false, msg: '쪽지가 전송되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteLetterNotifications() {
    const { id } = this.auth;

    try {
      const response = await LetterStorage.deleteLetterNotifications(id);

      if (response) {
        return { success: true, msg: '쪽지 알림이 모두 삭제되었습니다.' };
      }
      return { success: false, msg: '쪽지 알림이 삭제되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteLetters() {
    const { id } = this.auth;
    const { letterNo } = this.params;

    try {
      const { boardFlag, boardNo } = await LetterStorage.findLetterInfo(
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

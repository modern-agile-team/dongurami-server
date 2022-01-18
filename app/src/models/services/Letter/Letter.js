'use strict';

const LetterUtil = require('./LetterUtils');
const LetterStorage = require('./LetterStorage');
const Error = require('../../utils/Error');

const { makeMsg } = LetterUtil;

class Letter {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findLetterNotifications() {
    try {
      const letters = await LetterStorage.findLetterNotifications(this.auth.id);

      if (letters[0]) {
        LetterUtil.checkHiddenFlagForNoti(letters);
        return makeMsg(200, '쪽지 알람 전체 조회 성공', letters);
      }
      return makeMsg(200, '생성된 쪽지가 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllLetterList() {
    const { id } = this.auth;

    try {
      if (this.params.id !== id) {
        return makeMsg(403, '본인만 열람 가능합니다.');
      }

      const letters = await LetterStorage.findAllLetterList(id);

      if (letters[0]) {
        LetterUtil.checkHiddenFlag(letters);
        return makeMsg(200, '쪽지 전체 조회 성공', letters);
      }
      return makeMsg(200, '쪽지가 존재하지 않습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findLettersByGroup() {
    const { id } = this.auth;
    const { groupNo } = this.params;

    try {
      if (this.params.id !== id) return makeMsg(403, '본인만 열람 가능합니다.');

      const letterInfo = await LetterStorage.findLetterParticipantInfo({
        groupNo,
        id,
      });

      if (!letterInfo) return makeMsg(404, '존재하지 않는 쪽지입니다.');

      LetterUtil.divideId(letterInfo, id);

      if (await LetterStorage.updateReadingFlag(letterInfo)) {
        const letters = await LetterStorage.findLettersByGroup(letterInfo);

        if (letters) {
          LetterUtil.changeAnonymous(letters, id);
          return makeMsg(200, '쪽지 대화 목록 조회 성공', letters);
        }
      }
      return makeMsg(400, '쪽지 대화 목록 조회를 실패하였습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createLetter() {
    const data = this.body;
    const { id } = this.auth;

    try {
      let recipientHiddenFlag = 0;

      if (!data.recipientId.length) {
        recipientHiddenFlag = 1;
        await LetterUtil.findRecipientId(data);
      }

      if (id === data.recipientId) {
        return makeMsg(400, '본인에게 쪽지를 보낼 수 없습니다.');
      }

      const sendInfo = {
        recipientHiddenFlag,
        senderId: id,
        recipientId: data.recipientId,
        description: data.description,
        boardNo: data.boardNo,
        writerHiddenFlag: data.writerHiddenFlag,
      };

      if (!(recipientHiddenFlag || data.writerHiddenFlag)) {
        sendInfo.boardNo = await LetterStorage.findBoardNo(sendInfo);
      }

      const checkGroupNo = await LetterStorage.findOneByGroupNo(sendInfo);

      const { senderInsertNo, recipientInsertNo } =
        await LetterStorage.createLetter(sendInfo);

      const groupNo = LetterUtil.changeGroupNo(senderInsertNo, checkGroupNo);

      const result = await LetterStorage.updateGroupNo({
        senderInsertNo,
        recipientInsertNo,
        groupNo,
      });

      if (result) return makeMsg(201, '쪽지가 전송되었습니다.');
      return makeMsg(400, '쪽지가 전송되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createReplyLetter() {
    const { id } = this.auth;
    const { groupNo } = this.params;

    try {
      const letterInfo = await LetterStorage.findLetterByGroupNo({
        id,
        groupNo,
      });

      LetterUtil.divideId(letterInfo, id);

      const sendInfo = {
        senderId: letterInfo.id,
        recipientId: letterInfo.otherId,
        description: this.body.description,
        boardNo: letterInfo.boardNo,
        recipientHiddenFlag: letterInfo.otherHiddenFlag,
        writerHiddenFlag: letterInfo.myHiddenFlag,
      };

      const { senderInsertNo, recipientInsertNo } =
        await LetterStorage.createLetter(sendInfo);

      const result = await LetterStorage.updateGroupNo({
        senderInsertNo,
        recipientInsertNo,
        groupNo,
      });

      if (result === 2) return makeMsg(201, '쪽지가 전송되었습니다.');
      return makeMsg(400, '쪽지가 전송되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteLetterNotifications() {
    try {
      if (await LetterStorage.deleteLetterNotifications(this.auth.id)) {
        return makeMsg(200, '쪽지 알림이 모두 삭제되었습니다.');
      }
      return makeMsg(400, '삭제할 쪽지 알림이 없습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteLettersByGroupNo() {
    try {
      const letterInfo = {
        id: this.auth.id,
        groupNo: this.params.groupNo,
      };

      if (await LetterStorage.deleteLettersByGroupNo(letterInfo)) {
        return makeMsg(200, '쪽지가 모두 삭제되었습니다.');
      }
      return makeMsg(400, '쪽지가 삭제되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Letter;

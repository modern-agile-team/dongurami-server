'use strict';

const EmotionStorage = require('./EmotionStorage');
const EmotionUtil = require('./utils');
const BoardStorage = require('../Board/BoardStorage');
const CommentStorage = require('../Board/Comment/CommentStorage');
const Notification = require('../Notification/Notification');
const Error = require('../../utils/Error');

class Emotion {
  constructor(req) {
    this.auth = req.auth;
    this.req = req;
  }

  async likedByBoardNum() {
    const user = this.auth;
    const notification = new Notification(this.req);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const boardExistence = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!boardExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isCreat = await EmotionStorage.likedByBoardNum(emotionInfo);

      if (isCreat) {
        const { recipientId, recipientName, title } =
          await BoardStorage.findBoardInfoByBoardNum(emotionInfo.boardNum);

        if (user.id !== recipientId) {
          const notificationInfo = {
            title,
            recipientName,
            recipientId,
            senderName: user.name,
            content: '게시글 좋아요',
          };

          await notification.createNotification(notificationInfo);
        }

        return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByBoardNum() {
    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const boardExistence = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!boardExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isDelete = await EmotionStorage.unLikedByBoardNum(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async likedByCmtNum() {
    const user = this.auth;
    const notification = new Notification(this.req);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const cmtExistence = await EmotionStorage.existenceByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!cmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isCreat = await EmotionStorage.likedByCmtNum(emotionInfo);

      if (isCreat) {
        const { recipientId, recipientName, description } =
          await CommentStorage.findAllByCmtNum(emotionInfo.cmtInfo.cmtNum);

        if (emotionInfo.studentId !== recipientId) {
          const notificationInfo = {
            title: description,
            recipientName,
            recipientId,
            senderName: user.name,
            content: '댓글 좋아요',
          };

          await notification.createNotification(notificationInfo);
        }

        return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByCmtNum() {
    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const cmtExistence = await EmotionStorage.existenceByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!cmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isDelete = await EmotionStorage.unLikedByCmtNum(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async likedByReplyCmtNum() {
    const user = this.auth;
    const notification = new Notification(this.req);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const replyCmtExistence = await EmotionStorage.existenceByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!replyCmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isCreat = await EmotionStorage.likedByReplyCmtNum(emotionInfo);

      if (isCreat) {
        const { recipientId, recipientName, description } =
          await CommentStorage.findAllByCmtNum(emotionInfo.cmtInfo.replyCmtNum);

        if (emotionInfo.studentId !== recipientId) {
          const notificationInfo = {
            title: description,
            recipientName,
            recipientId,
            senderName: user.name,
            content: '답글 좋아요',
          };

          await notification.createNotification(notificationInfo);
        }
        return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByReplyCmtNum() {
    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(this.req);

      const replyCmtExistence = await EmotionStorage.existenceByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!replyCmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(this.req, 409);
      }

      const isDelete = await EmotionStorage.unLikedByReplyCmtNum(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(this.req, 200);
      return EmotionUtil.makeResponseByStatusCode(this.req, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Emotion;

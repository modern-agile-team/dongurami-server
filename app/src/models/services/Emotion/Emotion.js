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
    const request = this.req;
    const notification = new Notification(request);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const boardExistence = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!boardExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isCreate = await EmotionStorage.likedByTarget(emotionInfo);

      if (isCreate) {
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

        return EmotionUtil.makeResponseByStatusCode(request, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByBoardNum() {
    const request = this.req;

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const boardExistence = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!boardExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isDelete = await EmotionStorage.unlikedByTarget(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(request, 200);
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async likedByCmtNum() {
    const user = this.auth;
    const request = this.req;
    const notification = new Notification(request);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const cmtExistence = await EmotionStorage.existOnlyCmtByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!cmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isCreate = await EmotionStorage.likedByTarget(emotionInfo);

      if (isCreate) {
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

        return EmotionUtil.makeResponseByStatusCode(request, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByCmtNum() {
    const request = this.req;

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const cmtExistence = await EmotionStorage.existOnlyCmtByCmtNumAndDepth(
        emotionInfo.cmtInfo
      );

      if (!cmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isDelete = await EmotionStorage.unlikedByTarget(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(request, 200);
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async likedByReplyCmtNum() {
    const user = this.auth;
    const request = this.req;
    const notification = new Notification(this.req);

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const replyCmtExistence =
        await EmotionStorage.existOnlyCmtByCmtNumAndDepth(emotionInfo.cmtInfo);

      if (!replyCmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isCreate = await EmotionStorage.likedByTarget(emotionInfo);

      if (isCreate) {
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
        return EmotionUtil.makeResponseByStatusCode(request, 200);
      }
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByReplyCmtNum() {
    const request = this.req;

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const replyCmtExistence =
        await EmotionStorage.existOnlyCmtByCmtNumAndDepth(emotionInfo.cmtInfo);

      if (!replyCmtExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 404);
      }

      const emotionExistence = await EmotionStorage.existOnlyEmotion(
        emotionInfo
      );

      if (!emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isDelete = await EmotionStorage.unlikedByTarget(emotionInfo);

      if (isDelete) return EmotionUtil.makeResponseByStatusCode(request, 200);
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Emotion;

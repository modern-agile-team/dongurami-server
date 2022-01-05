'use strict';

const EmotionStorage = require('./EmotionStorage');
const EmotionUtil = require('./utils');
const Error = require('../../utils/Error');

class Emotion {
  constructor(req) {
    this.auth = req.auth;
    this.req = req;
  }

  async likedByBoardNum() {
    const request = this.req;

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const boardExistence = await EmotionStorage.existOnlyBoardNum(
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

      if (isCreate) return EmotionUtil.makeResponseByStatusCode(request, 200);
      return EmotionUtil.makeResponseByStatusCode(request, 400);
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async unLikedByBoardNum() {
    const request = this.req;

    try {
      const emotionInfo = EmotionUtil.makeEmotionInfo(request);

      const boardExistence = await EmotionStorage.existOnlyBoardNum(
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

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isCreate = await EmotionStorage.likedByTarget(emotionInfo);

      if (isCreate) return EmotionUtil.makeResponseByStatusCode(request, 200);
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

      if (emotionExistence) {
        return EmotionUtil.makeResponseByStatusCode(request, 409);
      }

      const isCreate = await EmotionStorage.likedByTarget(emotionInfo);

      if (isCreate) return EmotionUtil.makeResponseByStatusCode(request, 200);
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

'use strict';

const EmotionStorage = require('./EmotionStorage');
const BoardStorage = require('../Board/BoardStorage');
const CommentStorage = require('../Board/Comment/CommentStorage');
const Notification = require('../Notification/Notification');
const Error = require('../../utils/Error');

class Emotion {
  constructor(req) {
    this.auth = req.auth;
    this.params = req.params;
    this.req = req;
  }

  async xxNewGetRecipientInfo() {
    const { params } = this;
    let recipientInfo;

    if (params.boardNum) {
      recipientInfo = await BoardStorage.findBoardInfoByBoardNum(
        params.boardNum
      );

      recipientInfo.content = '게시물 좋아요';
    }
    if (params.cmtNum) {
      recipientInfo = await CommentStorage.findAllByCmtNum(params.cmtNum);

      recipientInfo.content = '댓글 좋아요';
    }
    if (params.replyCmtNum) {
      recipientInfo = await CommentStorage.findAllByCmtNum(params.replyCmtNum);

      recipientInfo.content = '답글 좋아요';
    }

    return recipientInfo;
  }

  async getNotificationInfo(recipientInfo) {
    // const { params } = this;
    // let recipientInfo;

    // if (params.boardNum) {
    //   recipientInfo = await BoardStorage.findBoardInfoByBoardNum(
    //     params.boardNum
    //   );

    //   recipientInfo.content = '게시물 좋아요';
    // }
    // if (params.cmtNum) {
    //   recipientInfo = await CommentStorage.findAllByCmtNum(params.cmtNum);

    //   recipientInfo.content = '댓글 좋아요';
    // }
    // if (params.replyCmtNum) {
    //   recipientInfo = await CommentStorage.findAllByCmtNum(params.replyCmtNum);

    //   recipientInfo.content = '답글 좋아요';
    // }

    return {
      title: recipientInfo.description,
      recipientName: recipientInfo.name,
      recipientId: recipientInfo.id,
      content: recipientInfo.content,
      senderName: this.auth.name,
    };
  }

  async sendNotification() {
    // const notificationInfo = this.getNotificationInfo();
    const recipientInfo = this.xxNewGetRecipientInfo();
    const notificationInfo = this.getNotificationInfo(recipientInfo);

    if (notificationInfo.senderId !== notificationInfo.recipientId) {
      this.createNotification(notificationInfo);
    }
  }

  createNotification(notificationInfo) {
    return new Notification(this.req).createNotification(notificationInfo);
  }

  async likedByBoardNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        boardNum: this.params.boardNum,
      };

      const isBoardExist = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!isBoardExist) {
        return {
          success: false,
          msg: '해당 게시글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (isEmotion) {
        return {
          success: false,
          msg: '이미 좋아요를 눌렀습니다.',
          status: 409,
        };
      }

      const isCreat = await EmotionStorage.likedByBoardNum(emotionInfo);

      if (isCreat) {
        await this.sendNotification();

        return {
          success: true,
          msg: '해당 게시글에 좋아요를 했습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 게시글에 좋아요를 실패했습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async unLikedByBoardNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        boardNum: this.params.boardNum,
      };

      const isBoardExist = await BoardStorage.existOnlyBoardNum(
        emotionInfo.boardNum
      );

      if (!isBoardExist) {
        return {
          success: false,
          msg: '해당 게시글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (!isEmotion)
        return {
          success: false,
          msg: '좋아요를 누르지 않았습니다.',
          status: 409,
        };

      const isDelete = await EmotionStorage.unLikedByBoardNum(emotionInfo);

      if (isDelete) {
        return {
          success: true,
          msg: '해당 게시글의 좋아요가 취소 되었습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 게시글의 좋아요가 취소되지 않았습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async likedByCmtNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        cmtNum: this.params.cmtNum,
      };

      const isCmtExist = await EmotionStorage.existOnlyCmtNum(
        emotionInfo.cmtNum
      );

      if (!isCmtExist) {
        return {
          success: false,
          msg: '해당 댓글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (isEmotion) {
        return {
          success: false,
          msg: '이미 좋아요를 눌렀습니다.',
          status: 409,
        };
      }

      const isCreat = await EmotionStorage.likedByCmtNum(emotionInfo);

      if (isCreat) {
        this.sendNotification();

        return {
          success: true,
          msg: '해당 댓글에 좋아요를 했습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 댓글에 좋아요를 실패했습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async unLikedByCmtNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        cmtNum: this.params.cmtNum,
      };

      const isCmtExist = await EmotionStorage.existOnlyCmtNum(
        emotionInfo.cmtNum
      );

      if (!isCmtExist) {
        return {
          success: false,
          msg: '해당 댓글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (!isEmotion) {
        return {
          success: false,
          msg: '좋아요를 누르지 않았습니다.',
          status: 409,
        };
      }

      const isDelete = await EmotionStorage.unLikedByCmtNum(emotionInfo);

      if (isDelete) {
        return {
          success: true,
          msg: '해당 댓글의 좋아요가 취소 되었습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 댓글의 좋아요가 취소되지 않았습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async likedByReplyCmtNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        replyCmtNum: this.params.replyCmtNum,
      };

      const isReplyCmtExist = await EmotionStorage.existOnlyReplyCmtNum(
        emotionInfo.replyCmtNum
      );

      if (!isReplyCmtExist) {
        return {
          success: false,
          msg: '해당 답글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (isEmotion) {
        return {
          success: false,
          msg: '이미 좋아요를 눌렀습니다.',
          status: 409,
        };
      }

      const isCreat = await EmotionStorage.likedByReplyCmtNum(emotionInfo);

      if (isCreat) {
        await this.sendNotification();

        return {
          success: true,
          msg: '해당 답글에 좋아요를 했습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 답글에 좋아요를 실패했습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async unLikedByReplyCmtNum() {
    const user = this.auth;

    try {
      const emotionInfo = {
        studentId: user.id,
        replyCmtNum: this.params.replyCmtNum,
      };

      const isReplyCmtExist = await EmotionStorage.existOnlyReplyCmtNum(
        emotionInfo.replyCmtNum
      );

      if (!isReplyCmtExist) {
        return {
          success: false,
          msg: '해당 답글이 존재하지 않습니다.',
          status: 404,
        };
      }

      const isEmotion = await EmotionStorage.isEmotion(emotionInfo);

      if (!isEmotion) {
        return {
          success: false,
          msg: '좋아요를 누르지 않았습니다.',
          status: 409,
        };
      }

      const isDelete = await EmotionStorage.unLikedByReplyCmtNum(emotionInfo);

      if (isDelete) {
        return {
          success: true,
          msg: '해당 답글의 좋아요가 취소 되었습니다.',
        };
      }
      return {
        success: false,
        msg: '해당 답글의 좋아요가 취소되지 않았습니다.',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Emotion;

'use strict';

const CommentStorage = require('./CommentStorage');
const BoardStorage = require('../BoardStorage');
const Notification = require('../../Notification/Notification');
const NotificationStorage = require('../../Notification/NotificationStorage');
const Error = require('../../../utils/Error');

class Comment {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createCommentNum() {
    const { body } = this;
    const userInfo = this.auth;
    const notification = new Notification(this.req);

    try {
      const commentInfo = {
        boardNum: this.params.boardNum,
        id: userInfo.id,
        description: body.description,
      };
      const exist = await BoardStorage.existOnlyBoardNum(commentInfo.boardNum);
      const senderId = userInfo.id;
      if (exist === undefined) {
        return { success: false, msg: '해당 게시글이 존재하지 않습니다.' };
      }

      const commentNum = await CommentStorage.createCommentNum(commentInfo);

      await CommentStorage.updateOnlyGroupNum(commentNum);

      body.recipientIds.forEach(async (recipientId) => {
        if (senderId !== recipientId) {
          const boardTitle = await NotificationStorage.findTitleByBoardNum(
            commentInfo.boardNum
          );

          const notificationInfo = {
            senderId,
            recipientId,
            boardTitle,
            content: commentInfo.description,
          };
          await notification.createByIdAndTitle(notificationInfo);
        }
      });

      return { success: true, msg: '댓글 생성 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async createReplyCommentNum() {
    const { body } = this;
    const userInfo = this.auth;
    const notification = new Notification(this.req);

    try {
      const replyCommentInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
        id: userInfo.id,
        description: body.description,
      };
      const senderId = userInfo.id;
      const exist = await CommentStorage.existOnlyCmtNum(
        replyCommentInfo.cmtNum,
        replyCommentInfo.boardNum
      );

      if (exist === undefined) {
        return { success: false, msg: '해당 게시글이나 댓글이 없습니다.' };
      }
      await CommentStorage.createReplyCommentNum(replyCommentInfo);

      body.recipientIds.forEach(async (recipientId) => {
        if (senderId !== recipientId) {
          const boardTitle = await NotificationStorage.findTitleByBoardNum(
            replyCommentInfo.boardNum
          );

          const notificationInfo = {
            senderId,
            recipientId,
            boardTitle,
            content: commentInfo.description,
          };

          await notification.createByIdAndTitle(notificationInfo);
        }
      });

      return { success: true, msg: '답글 생성 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByBoardNum() {
    try {
      const { boardNum } = this.params;
      const comments = await CommentStorage.findAllByBoardNum(boardNum);

      return comments;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateByCommentNum() {
    try {
      const cmtInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
        description: this.body.description,
      };
      const updateCmtCount = await CommentStorage.updateByCommentNum(cmtInfo);

      if (updateCmtCount === 0) {
        return { success: false, msg: '해당 글에 존재하지 않는 댓글 입니다.' };
      }
      return { success: true, msg: '댓글 수정 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateByReplyCommentNum() {
    try {
      const replyCmtInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
        replyCmtNum: this.params.replyCmtNum,
        description: this.body.description,
      };
      const updateReplyCmtCount = await CommentStorage.updateByReplyCommentNum(
        replyCmtInfo
      );

      if (updateReplyCmtCount === 0) {
        return { success: false, msg: '존재하지 않는 답글입니다.' };
      }
      return { success: true, msg: '답글 수정 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async deleteAllByGroupNum() {
    try {
      const cmtInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
      };
      const deleteCmtCount = await CommentStorage.deleteAllByGroupNum(cmtInfo);

      if (deleteCmtCount === 0) {
        return { success: false, msg: '해당 글에 존재하지 않는 댓글 입니다.' };
      }
      return { success: true, msg: '댓글 삭제 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async deleteOneReplyCommentNum() {
    try {
      const replyCmtInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
        replyCmtNum: this.params.replyCmtNum,
      };
      const deleteReplyCmtCount = await CommentStorage.deleteOneReplyCommentNum(
        replyCmtInfo
      );

      if (deleteReplyCmtCount === 0) {
        return { success: false, msg: '존재하지 않는 답글입니다.' };
      }
      const replyCmtCount = await CommentStorage.existOnlyReplyCmtNum(
        replyCmtInfo
      );

      if (replyCmtCount === undefined) {
        const replyCmt = await CommentStorage.updateOnlyReplyFlag(
          replyCmtInfo.cmtNum
        );

        if (replyCmt === 0) {
          return Error.ctrl(
            '서버에러입니다. 서버 개발자에게 얘기해주세요.',
            err
          );
        }
      }
      return { success: true, msg: '답글 삭제 성공' };
    } catch (err) {
      return Error.ctrl('서버에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Comment;

'use strict';

const CommentStorage = require('./CommentStorage');
const BoardStorage = require('../BoardStorage');
const Notification = require('../../Notification/Notification');
const Error = require('../../../utils/Error');
const WriterCheck = require('../../../utils/WriterCheck');

class Comment {
  constructor(req) {
    this.req = req;
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async createCommentNum() {
    const comment = this.body;
    const user = this.auth;
    const notification = new Notification(this.req);

    try {
      const commentInfo = {
        boardNum: this.params.boardNum,
        id: user.id,
        description: comment.description,
      };

      if (!comment.description) {
        return { success: false, msg: '댓글 본문이 존재하지 않습니다.' };
      }

      const exist = await BoardStorage.existOnlyBoardNum(commentInfo.boardNum);

      if (exist === undefined) {
        return { success: false, msg: '해당 게시글이 존재하지 않습니다.' };
      }

      const commentNum = await CommentStorage.createCommentNum(commentInfo);

      await CommentStorage.updateOnlyGroupNum(commentNum);

      const writerId = await CommentStorage.findOneByBoardNum(
        commentInfo.boardNum
      );

      if (user.id !== writerId) {
        const { recipientName, title } =
          await BoardStorage.findRecipientNameAndTitleByBoardNum(
            commentInfo.boardNum
          );

        const notificationInfo = {
          title,
          recipientName,
          senderName: user.name,
          content: commentInfo.description,
        };

        await notification.createCmtNotification(notificationInfo);
      }

      return { success: true, msg: '댓글 생성 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async createReplyCommentNum() {
    const replyComment = this.body;
    const user = this.auth;
    const { params } = this;
    const notification = new Notification(this.req);

    try {
      const replyCommentInfo = {
        boardNum: params.boardNum,
        cmtNum: params.cmtNum,
        id: user.id,
        description: replyComment.description,
      };

      if (!replyComment.description) {
        return { success: false, msg: '답글 본문이 존재하지 않습니다.' };
      }

      const exist = await CommentStorage.existOnlyCmtNum(
        replyCommentInfo.cmtNum,
        replyCommentInfo.boardNum
      );

      if (exist === undefined) {
        return { success: false, msg: '해당 게시글이나 댓글이 없습니다.' };
      }

      await CommentStorage.createReplyCommentNum(replyCommentInfo);

      const recipientNames =
        await CommentStorage.findStudentNamesByCmtAndBoardNum(
          replyCommentInfo.cmtNum,
          replyCommentInfo.boardNum
        );

      const senderName = user.name;

      const { title } = await BoardStorage.findRecipientNameAndTitleByBoardNum(
        replyCommentInfo.boardNum
      );

      recipientNames.forEach(async (recipientName) => {
        if (senderName !== recipientName) {
          const notificationInfo = {
            senderName,
            recipientName,
            title,
            content: replyCommentInfo.description,
          };

          await notification.createCmtNotification(notificationInfo);
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
    const { params } = this;

    try {
      const cmtInfo = {
        boardNum: params.boardNum,
        cmtNum: params.cmtNum,
        description: this.body.description,
      };

      if (!comment.description) {
        return { success: false, msg: '댓글 본문이 존재하지 않습니다.' };
      }

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

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
    const { params } = this;

    try {
      const replyCmtInfo = {
        boardNum: params.boardNum,
        cmtNum: params.cmtNum,
        replyCmtNum: params.replyCmtNum,
        description: this.body.description,
      };

      if (!comment.description) {
        return { success: false, msg: '답글 본문이 존재하지 않습니다.' };
      }

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        replyCmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

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
    const { params } = this;

    try {
      const cmtInfo = {
        boardNum: params.boardNum,
        cmtNum: params.cmtNum,
      };

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

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
    const { params } = this;

    try {
      const replyCmtInfo = {
        boardNum: params.boardNum,
        cmtNum: params.cmtNum,
        replyCmtNum: params.replyCmtNum,
      };

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        replyCmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

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

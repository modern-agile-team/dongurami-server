'use strict';

const CommentStorage = require('./CommentStorage');
const Error = require('../../../utils/Error');

class Comment {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async createCommentNum() {
    try {
      const commentInfo = {
        boardNum: this.params.boardNum,
        id: this.body.id,
        description: this.body.description,
      };
      const commentNum = await CommentStorage.createCommentNum(commentInfo);
      await CommentStorage.updateOnlyGroupNum(commentNum);

      return { success: true, msg: '댓글 생성 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async createReplyCommentNum() {
    try {
      const replyCommentInfo = {
        boardNum: this.params.boardNum,
        cmtNum: this.params.cmtNum,
        id: this.body.id,
        description: this.body.description,
      };
      const exist = await CommentStorage.existOnlycmtNum(
        replyCommentInfo.cmtNum,
        replyCommentInfo.boardNum
      );

      if (exist === undefined) {
        return { success: false, msg: '해당 게시글이나 댓글이 없습니다.' };
      }
      await CommentStorage.createReplyCommentNum(replyCommentInfo);

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
}

module.exports = Comment;

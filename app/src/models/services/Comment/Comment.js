'use strict';

const CommentStorage = require('./CommentStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const boardCategory = require('../Category/board');
const getRequestNullKey = require('../../utils/getRequestNullKey');
const makeResponse = require('../../utils/makeResponse');

class Comment {
  constructor(req) {
    this.body = req.body;
    this.query = req.query;
    this.auth = req.auth;
  }

  async createCommentNum() {
    const comment = this.body;
    const commentInfo = {
      boardNum: this.query.boardNum,
      id: this.auth.id,
      description: comment.description,
      hiddenFlag: comment.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(comment, ['description']);

    if (nullKey) {
      return makeResponse(400, `${nullKey}이(가) 존재하지 않습니다.`);
    }

    if (boardCategory[this.query.category] === 5 && commentInfo.hiddenFlag) {
      return makeResponse(400, '해당 게시판에서 익명 사용이 불가능합니다.');
    }

    try {
      const isExist = await CommentStorage.existOnlyBoardNum(
        commentInfo.boardNum
      );

      if (isExist === undefined) {
        return makeResponse(404, '해당 게시글이 존재하지 않습니다.');
      }

      const commentNum = await CommentStorage.createCommentNum(commentInfo);

      if (!commentNum) return makeResponse(400, '댓글 생성 실패');

      const isUpdate = await CommentStorage.updateOnlyGroupNum(commentNum);

      if (isUpdate) return makeResponse(201, '댓글 생성 성공');
      return makeResponse(400, '댓글 생성 실패');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createReplyCommentNum() {
    const replyComment = this.body;
    const user = this.auth;
    const { query } = this;
    const replyCommentInfo = {
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
      id: user.id,
      description: replyComment.description,
      hiddenFlag: replyComment.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(replyComment, ['description']);

    if (nullKey) {
      return makeResponse(400, `${nullKey}이(가) 존재하지 않습니다.`);
    }

    try {
      const isExist = await CommentStorage.existOnlyCmtNum(
        replyCommentInfo.cmtNum,
        replyCommentInfo.boardNum
      );

      if (isExist === undefined) {
        return makeResponse(404, '해당 게시글이나 댓글이 없습니다.');
      }

      if (
        boardCategory[this.query.category] === 5 &&
        replyCommentInfo.hiddenFlag
      ) {
        return makeResponse(400, '해당 게시판에서는 익명 사용이 불가능합니다.');
      }

      await CommentStorage.createReplyCommentNum(replyCommentInfo);

      if (replyCommentInfo.hiddenFlag) {
        user.name = '익명';
      }

      return makeResponse(201, '답글 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllByBoardNum() {
    const user = this.auth;
    const boardInfo = {
      boardNum: this.query.boardNum,
      studentId: user ? user.id : 0,
      category: boardCategory[this.query.category],
    };
    const anonymous = {};

    try {
      const board = await CommentStorage.existOnlyBoardNum(boardInfo.boardNum);

      if (board.writerHiddenFlag) {
        anonymous[board.studentId] = '익명1';
      }

      const comments = await CommentStorage.findAllByBoardNum(boardInfo);

      for (const comment of comments) {
        comment.isWriter = boardInfo.studentId === comment.studentId ? 1 : 0;
        comment.likedFlag += comment.replyLikedFlag;
        comment.emotionCount += comment.replyEmotionCount;
        delete comment.replyLikedFlag;
        delete comment.replyEmotionCount;

        if (comment.writerHiddenFlag) {
          const samePersonIdx = Object.keys(anonymous).indexOf(
            comment.studentId
          );

          if (samePersonIdx > -1) {
            comment.studentName = anonymous[comment.studentId];
            comment.studentId = anonymous[comment.studentId];
            comment.profileImageUrl = null;
          } else {
            const newPerson = `익명${Object.keys(anonymous).length + 1}`;

            anonymous[comment.studentId] = newPerson;
            comment.studentId = newPerson;
            comment.studentName = newPerson;
            comment.profileImageUrl = null;
          }
        }
      }

      return comments;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async updateByCommentNum() {
    const comment = this.body;
    const cmtInfo = {
      boardNum: this.query.boardNum,
      cmtNum: this.query.cmtNum,
      description: comment.description,
      hiddenFlag: comment.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(comment, ['description']);

    if (nullKey) {
      return makeResponse(400, `${nullKey}이(가) 존재하지 않습니다.`);
    }

    try {
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const updateCmtCount = await CommentStorage.updateByCommentNum(cmtInfo);

      if (updateCmtCount === 0) {
        return makeResponse(404, '존재하지 않는 댓글입니다.');
      }
      return makeResponse(200, '댓글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateByReplyCommentNum() {
    const replyComment = this.body;
    const replyCmtInfo = {
      boardNum: this.query.boardNum,
      cmtNum: this.query.cmtNum,
      replyCmtNum: this.query.replyCmtNum,
      description: replyComment.description,
      hiddenFlag: replyComment.hiddenFlag || 0,
    };

    const nullKey = getRequestNullKey(replyComment, ['description']);

    if (nullKey) {
      return makeResponse(400, `${nullKey}이(가) 존재하지 않습니다.`);
    }

    try {
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        replyCmtInfo.replyCmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const isUpdate = await CommentStorage.updateByReplyCommentNum(
        replyCmtInfo
      );

      if (isUpdate === 0) {
        return makeResponse(404, '존재하지 않는 답글입니다.');
      }
      return makeResponse(200, '답글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteAllByGroupNum() {
    const cmtInfo = {
      boardNum: this.query.boardNum,
      cmtNum: this.query.cmtNum,
    };

    try {
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const isDelete = await CommentStorage.deleteAllByGroupNum(cmtInfo);

      if (isDelete === 0) {
        return makeResponse(404, '존재하지 않는 댓글입니다.');
      }
      return makeResponse(200, '댓글 삭제 성공 ');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteOneReplyCommentNum() {
    const replyCmtInfo = {
      boardNum: this.query.boardNum,
      cmtNum: this.query.cmtNum,
      replyCmtNum: this.query.replyCmtNum,
    };

    try {
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        replyCmtInfo.replyCmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const isDelete = await CommentStorage.deleteOneReplyCommentNum(
        replyCmtInfo
      );

      if (isDelete === 0) {
        return makeResponse(404, '존재하지 않는 답글입니다.');
      }
      const isExist = await CommentStorage.existOnlyReplyCmtNum(replyCmtInfo);

      if (isExist === undefined) {
        const isUpdate = await CommentStorage.updateOnlyReplyFlag(
          replyCmtInfo.cmtNum
        );

        if (isUpdate === 0) {
          return Error.ctrl(
            '서버에러입니다. 서버 개발자에게 얘기해주세요.',
            err
          );
        }
      }
      return makeResponse(200, '답글 삭제 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Comment;

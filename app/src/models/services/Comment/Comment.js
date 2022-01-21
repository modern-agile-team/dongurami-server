'use strict';

const CommentStorage = require('./CommentStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');
const getRequestNullKey = require('../../utils/getRequestNullKey');
const makeResponse = require('../../utils/makeResponse');
const boardCategory = require('../Category/board');

class Comment {
  constructor(req) {
    this.body = req.body;
    this.query = req.query;
    this.auth = req.auth;
  }

  async createCommentNum() {
    const { query } = this;
    const comment = this.body;
    const category = boardCategory[query.boardCategory];
    const commentInfo = {
      id: this.auth.id,
      boardNum: query.boardNum,
      description: comment.description,
      hiddenFlag: comment.hiddenFlag || 0,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const bodyNullKey = getRequestNullKey(comment, ['description']);

    if (bodyNullKey) {
      return makeResponse(400, `body의 ${bodyNullKey}이(가) 빈 값입니다.`);
    }

    if (category === 5 && commentInfo.hiddenFlag) {
      return makeResponse(400, '해당 게시판에서 익명 사용이 불가능합니다.');
    }

    try {
      const isExist = await CommentStorage.existOnlyBoardNum(
        query.boardNum,
        category
      );

      if (!isExist) {
        return makeResponse(404, '해당 게시글이 존재하지 않습니다.');
      }

      const commentNum = await CommentStorage.createCommentNum(commentInfo);

      if (!commentNum) return Error.dbError();

      const isUpdate = await CommentStorage.updateOnlyGroupNum(commentNum);

      if (!isUpdate) return Error.dbError();
      return makeResponse(201, '댓글 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createReplyCommentNum() {
    const { query } = this;
    const replyComment = this.body;
    const category = boardCategory[this.query.boardCategory];
    const replyCommentInfo = {
      id: this.user.id,
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
      description: replyComment.description,
      hiddenFlag: replyComment.hiddenFlag || 0,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
      'cmtNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const bodyNullKey = getRequestNullKey(replyComment, ['description']);

    if (bodyNullKey) {
      return makeResponse(400, `body의 ${bodyNullKey}이(가) 빈 값입니다.`);
    }

    if (category === 5 && replyCommentInfo.hiddenFlag) {
      return makeResponse(400, '해당 게시판에서는 익명 사용이 불가능합니다.');
    }

    try {
      const isExist = await CommentStorage.existOnlyCmtNum(replyCommentInfo);

      if (!isExist) {
        return makeResponse(404, '해당 게시글이나 댓글이 없습니다.');
      }

      const isCreate = await CommentStorage.createReplyCommentNum(
        replyCommentInfo
      );

      if (!isCreate) return Error.dbError();

      const isUpdate = await CommentStorage.updateOnlyReplyFlag(
        1,
        replyCommentInfo.cmtNum
      );

      if (!isUpdate) return Error.dbError();
      return makeResponse(201, '답글 생성 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateByCommentNum() {
    const { query } = this;
    const comment = this.body;
    const cmtInfo = {
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
      description: comment.description,
      hiddenFlag: comment.hiddenFlag || 0,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
      'cmtNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const bodyNullKey = getRequestNullKey(comment, ['description']);

    if (bodyNullKey) {
      return makeResponse(400, `body의 ${bodyNullKey}이(가) 빈 값입니다.`);
    }

    try {
      const isExist = await CommentStorage.existOnlyCmtNum(query);

      if (!isExist) return makeResponse(404, '존재하지 않는 댓글입니다.');

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const updateCmtCount = await CommentStorage.updateByCommentNum(cmtInfo);

      if (!updateCmtCount) {
        return makeResponse(404, '존재하지 않는 댓글입니다.');
      }
      return makeResponse(200, '댓글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async updateByReplyCommentNum() {
    const { query } = this;
    const replyComment = this.body;
    const replyCmtInfo = {
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
      replyCmtNum: query.replyCmtNum,
      description: replyComment.description,
      hiddenFlag: replyComment.hiddenFlag || 0,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
      'cmtNum',
      'replyCmtNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    const bodyNullKey = getRequestNullKey(replyComment, ['description']);

    if (bodyNullKey) {
      return makeResponse(400, `body의 ${bodyNullKey}이(가) 빈 값입니다.`);
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

      if (!isUpdate) return makeResponse(404, '존재하지 않는 답글입니다.');
      return makeResponse(200, '답글 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteAllByGroupNum() {
    const { query } = this;
    const cmtInfo = {
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
      'cmtNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

    try {
      const isExist = await CommentStorage.existOnlyCmtNum(query);

      if (!isExist) return makeResponse(404, '존재하지 않는 댓글입니다.');

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        cmtInfo.cmtNum,
        'comments'
      );

      if (!writerCheck.success) return writerCheck;

      const isDelete = await CommentStorage.deleteAllByGroupNum(cmtInfo);

      if (!isDelete) return makeResponse(404, '존재하지 않는 댓글입니다.');
      return makeResponse(200, '댓글 삭제 성공 ');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteOneReplyCommentNum() {
    const { query } = this;
    const replyCmtInfo = {
      boardNum: query.boardNum,
      cmtNum: query.cmtNum,
      replyCmtNum: query.replyCmtNum,
    };

    const queryNullKey = getRequestNullKey(query, [
      'boardCategory',
      'boardNum',
      'cmtNum',
      'replyCmtNum',
    ]);

    if (queryNullKey) {
      return makeResponse(400, `query의 ${queryNullKey}이(가) 빈 값입니다.`);
    }

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

      if (!isDelete) return makeResponse(404, '존재하지 않는 답글입니다.');

      const isExist = await CommentStorage.existOnlyReplyCmtNum(replyCmtInfo);

      if (!isExist) {
        const isUpdate = await CommentStorage.updateOnlyReplyFlag(
          0,
          replyCmtInfo.cmtNum
        );

        if (!isUpdate) return Error.dbError();
        return makeResponse(200, '답글 삭제 성공');
      }
      return makeResponse(200, '답글 삭제 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Comment;

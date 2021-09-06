'use strict';

const CommentStorage = require('./CommentStorage');
const Error = require('../../../utils/Error');

class Comment {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async findAllByBoardNum() {
    const boardNum = this.params.num;

    try {
      const comments = await CommentStorage.findAllByBoardNum(boardNum);

      return comments;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Comment;

'use strict';

const mariadb = require('../../../config/mariadb');

class CommentStorage {
  static async createCommentNum(commentInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO comments
        (board_no, student_id, description, writer_hidden_flag)
        VALUES (?, ?, ?, ?);`;

      const comment = await conn.query(query, [
        commentInfo.boardNum,
        commentInfo.id,
        commentInfo.description,
        commentInfo.hiddenFlag,
      ]);

      return comment.insertId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createReplyCommentNum(replyCommentInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO comments
        (board_no, student_id, description, group_no, depth, writer_hidden_flag)
        VALUES (?, ?, ?, ?, 1, ?);`;

      const replyComment = await conn.query(query, [
        replyCommentInfo.boardNum,
        replyCommentInfo.id,
        replyCommentInfo.description,
        replyCommentInfo.cmtNum,
        replyCommentInfo.hiddenFlag,
        replyCommentInfo.cmtNum,
      ]);

      return replyComment.insertId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyBoardNum(boardNum, boardCategory) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no
        FROM boards
        WHERE no = ? AND board_category_no = ?;`;

      const board = await conn.query(query, [boardNum, boardCategory]);

      return board[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyCmtNum(cmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no
        FROM comments
        WHERE no = ? AND board_no = ? AND depth = 0;`;

      const cmt = await conn.query(query, [cmtInfo.cmtNum, cmtInfo.boardNum]);

      return cmt[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyReplyCmtNum(replyCmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no 
        FROM comments
        WHERE board_no = ? AND group_no = ? AND depth = 1;`;

      const replyCmt = await conn.query(query, [
        replyCmtInfo.boardNum,
        replyCmtInfo.cmtNum,
      ]);

      return replyCmt[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyGroupNum(groupNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE comments
        SET group_no = ?
        WHERE no = ?;`;

      const comment = await conn.query(query, [groupNum, groupNum]);

      return comment.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyReplyFlag(flag, cmtNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE comments
        SET reply_flag = ?
        WHERE no = ?;`;

      const replycmt = await conn.query(query, [flag, cmtNum]);

      return replycmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateByCommentNum(cmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE comments
        SET description = ?, writer_hidden_flag = ?
        WHERE depth = 0 AND no = ? AND board_no = ?;`;

      const cmt = await conn.query(query, [
        cmtInfo.description,
        cmtInfo.hiddenFlag,
        cmtInfo.cmtNum,
        cmtInfo.boardNum,
      ]);

      return cmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateByReplyCommentNum(replyCmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE comments
        SET description = ?, writer_hidden_flag = ?
        WHERE depth = 1 AND no = ? AND board_no = ? AND group_no = ?;`;

      const replyCmt = await conn.query(query, [
        replyCmtInfo.description,
        replyCmtInfo.hiddenFlag,
        replyCmtInfo.replyCmtNum,
        replyCmtInfo.boardNum,
        replyCmtInfo.cmtNum,
      ]);

      return replyCmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteAllByGroupNum(cmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM comments
        WHERE group_no = ? AND board_no = ?;`;

      const cmt = await conn.query(query, [cmtInfo.cmtNum, cmtInfo.boardNum]);

      return cmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneReplyCommentNum(replyCmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM comments
        WHERE depth = 1 AND no = ? AND board_no = ? AND group_no = ?;`;

      const cmt = await conn.query(query, [
        replyCmtInfo.replyCmtNum,
        replyCmtInfo.boardNum,
        replyCmtInfo.cmtNum,
      ]);

      return cmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = CommentStorage;

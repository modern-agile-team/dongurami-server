'use strict';

const mariadb = require('../../../../config/mariadb');

class CommentStorage {
  static async createCommentNum(commentInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO comments (board_no, student_id, description) VALUES (?, ?, ?);`;

      const comment = await conn.query(query, [
        commentInfo.boardNum,
        commentInfo.id,
        commentInfo.description,
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

      const query = `INSERT INTO comments (board_no, student_id, description, group_no, depth) VALUES (?, ?, ?, ?, 1);
      UPDATE comments SET reply_flag = 1, modify_date = modify_date WHERE no = ?;`;

      await conn.query(query, [
        replyCommentInfo.boardNum,
        replyCommentInfo.id,
        replyCommentInfo.description,
        replyCommentInfo.cmtNum,
        replyCommentInfo.cmtNum,
      ]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT cmt.student_id AS studentId, st.name AS studentName, cmt.no, cmt.description, cmt.depth, cmt.group_no AS groupNo, cmt.reply_flag AS replyFlag, cmt.in_date AS inDate, cmt.modify_date AS modifyDate, st.profile_image_url AS profileImageUrl
      FROM comments AS cmt
      JOIN students AS st
      ON cmt.student_id = st.id
      WHERE cmt.board_no = ?
      ORDER BY cmt.group_no, inDate;`;

      const comments = await conn.query(query, [boardNum]);

      return comments;
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

      const query = `UPDATE comments SET description = ? WHERE depth = 0 AND no = ? AND board_no = ?;`;

      const cmt = await conn.query(query, [
        cmtInfo.description,
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

      const query = `UPDATE comments SET description = ? WHERE depth = 1 AND no = ? AND board_no = ? AND group_no = ?;`;

      const replyCmt = await conn.query(query, [
        replyCmtInfo.description,
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

      const query = `DELETE FROM comments WHERE group_no = ? AND board_no = ?;`;

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

      const query = `DELETE FROM comments WHERE depth = 1 AND no = ? AND board_no = ? AND group_no = ?;`;

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

  static async updateOnlyGroupNum(groupNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE comments SET group_no = ? WHERE no = ?;`;

      await conn.query(query, [groupNum, groupNum]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyReplyFlag(cmtNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE comments SET reply_flag = 0, modify_date = modify_date WHERE no = ?;`;

      const replycmt = conn.query(query, [cmtNum]);

      return replycmt.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyCmtNum(cmtNum, boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM comments WHERE no = ? AND board_no = ? AND depth = 0;`;

      const cmt = await conn.query(query, [cmtNum, boardNum]);

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

      const query = `SELECT no FROM comments WHERE board_no = ? AND group_no = ? AND depth = 1;`;

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

  static async findStudentNamesByCmtAndBoardNum(cmtNum, boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT DISTINCT s.name FROM comments AS c 
        JOIN students AS s ON c.student_id = s.id 
        WHERE c.board_no = ? AND c.group_no = ?;`;

      const comments = await conn.query(query, [boardNum, cmtNum]);

      const recipientNames = [];

      comments.forEach((comment) => {
        recipientNames.push(comment.name);
      });

      return recipientNames;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM boards WHERE no = ?;`;

      const writer = await conn.query(query, [boardNum]);

      return writer[0].studentId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = CommentStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class EmotionStorage {
  static async likedByBoardNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO board_emotions (student_id, board_no) VALUES (?, ?);`;

      const isCreate = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.boardNum,
      ]);

      return isCreate.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async unLikedByBoardNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM board_emotions WHERE student_id = ? AND board_no = ?;`;

      const isDelete = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.boardNum,
      ]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async likedByCmtNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO comment_emotions (student_id, comment_no) VALUES (?, ?);`;

      const isCreate = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.cmtNum,
      ]);

      return isCreate.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async unLikedByCmtNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM comment_emotions WHERE student_id = ? AND comment_no = ?;`;

      const isDelete = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.cmtNum,
      ]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async likedByReplyCmtNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO reply_comment_emotions (student_id, reply_comment_no) VALUES (?, ?);`;

      const isCreate = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.replyCmtNum,
      ]);

      return isCreate.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async unLikedByReplyCmtNum(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM reply_comment_emotions WHERE student_id = ? AND reply_comment_no = ?;`;

      const isDelete = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.replyCmtNum,
      ]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async isEmotion(emotionInfo) {
    let conn;
    let table;
    let column;

    try {
      conn = await mariadb.getConnection();

      if (emotionInfo.boardNum) {
        table = 'board_emotions';
        column = 'board_no';
      } else if (emotionInfo.cmtNum) {
        table = 'comment_emotions';
        column = 'comment_no';
      } else if (emotionInfo.replyCmtNum) {
        table = 'reply_comment_emotions';
        column = 'reply_comment_no';
      }

      const query = `SELECT no FROM ${table} WHERE student_id = ? AND ${column} = ?;`;

      const isExist = await conn.query(query, [
        emotionInfo.studentId,
        emotionInfo.boardNum || emotionInfo.cmtNum || emotionInfo.replyCmtNum,
      ]);

      return isExist[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyCmtNum(cmtNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM comments WHERE no = ? AND depth = 0;`;

      const cmt = await conn.query(query, [cmtNum]);

      return cmt[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyReplyCmtNum(replyCmtNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM comments WHERE no = ? AND depth = 1;`;

      const replyCmt = await conn.query(query, [replyCmtNum]);

      return replyCmt[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = EmotionStorage;

'use strict';

const mariadb = require('../../../config/mariadb');
const EmotionUtil = require('./utils');

class EmotionStorage {
  static async likedByTarget(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const cloumnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);
      const { table, column } =
        EmotionUtil.getTableAndcolumnByEmotionInfo(emotionInfo);

      const query = `INSERT INTO ${table} (student_id, ${column}) VALUES (?, ?);`;

      const isCreat = await conn.query(query, [
        emotionInfo.studentId,
        cloumnValue,
      ]);

      return isCreat.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async unlikedByTarget(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const cloumnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);
      const { table, column } =
        EmotionUtil.getTableAndcolumnByEmotionInfo(emotionInfo);

      const query = `DELETE FROM ${table} WHERE student_id = ? AND ${column} = ?;`;

      const isDelete = await conn.query(query, [
        emotionInfo.studentId,
        cloumnValue,
      ]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

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
        emotionInfo.cmtInfo.cmtNum,
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
        emotionInfo.cmtInfo.cmtNum,
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
        emotionInfo.cmtInfo.replyCmtNum,
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
        emotionInfo.cmtInfo.replyCmtNum,
      ]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyEmotion(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const { table, column } =
        EmotionUtil.getTableAndcolumnByEmotionInfo(emotionInfo);
      const cloumnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);

      const query = `SELECT no FROM ${table} WHERE student_id = ? AND ${column} = ?;`;

      const existence = await conn.query(query, [
        emotionInfo.studentId,
        cloumnValue,
      ]);

      return existence[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyCmtByCmtNumAndDepth(cmtInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM comments WHERE no = ? AND depth = ?;`;

      const existence = await conn.query(query, [
        cmtInfo.cmtNum || cmtInfo.replyCmtNum,
        cmtInfo.depth,
      ]);

      return existence[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = EmotionStorage;

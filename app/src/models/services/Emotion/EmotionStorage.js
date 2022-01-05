'use strict';

const mariadb = require('../../../config/mariadb');
const EmotionUtil = require('./utils');

class EmotionStorage {
  static async likedByTarget(emotionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const columnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);
      const { table, column } =
        EmotionUtil.getTableAndcolumnByEmotionInfo(emotionInfo);

      const query = `INSERT INTO ${table} (student_id, ${column}) VALUES (?, ?);`;

      const isCreate = await conn.query(query, [
        emotionInfo.studentId,
        columnValue,
      ]);

      return isCreate.affectedRows;
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

      const columnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);
      const { table, column } =
        EmotionUtil.getTableAndcolumnByEmotionInfo(emotionInfo);

      const query = `DELETE FROM ${table} WHERE student_id = ? AND ${column} = ?;`;

      const isDelete = await conn.query(query, [
        emotionInfo.studentId,
        columnValue,
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
      const columnValue = EmotionUtil.getTargetValueByEmotionInfo(emotionInfo);

      const query = `SELECT no FROM ${table} WHERE student_id = ? AND ${column} = ?;`;

      const existence = await conn.query(query, [
        emotionInfo.studentId,
        columnValue,
      ]);

      return existence[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM boards WHERE no = ?;`;

      const existence = await conn.query(query, [boardNum]);

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

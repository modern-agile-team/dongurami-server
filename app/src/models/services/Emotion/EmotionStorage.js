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

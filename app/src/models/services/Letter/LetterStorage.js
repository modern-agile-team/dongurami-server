'use strict';

const mariadb = require('../../../config/mariadb');

class LetterStorage {
  static async findRecipientByBoard(boardNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM boards WHERE no = ?;`;

      const recipientId = await query(qeury, boardNo);

      return recipientId[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findrecipientByComment(boardNo, commentNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM comments WHERE board_no = ? AND no = ?;`;

      const recipientId = await query(query, [boardNo, commentNo]);

      return recipientId[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createLetterByBoard(sendInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'INSERT INTO letters (sender_id, recipient_id, board_flag, board_no, writer_hidden_flag) VALUES (?, ?, 1, ?, ?);';

      const letter = await query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.boardNO,
        sendInfo.writerHiddenFlag,
      ]);

      return letter.affactedRow();
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createLetterByComment(sendInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO letters (sender_id, recipient_id, board_flag, board_no, writer_hidden_flag) VALUES (?, ?, 0, ?, ?);`;

      const letter = await query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.boardNO,
        sendInfo.writerHiddenFlag,
      ]);

      return letter.affactedRow();
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = LetterStorage;

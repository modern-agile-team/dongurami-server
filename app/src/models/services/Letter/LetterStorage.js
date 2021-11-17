'use strict';

const mariadb = require('../../../config/mariadb');

class LetterStorage {
  static async findLetters(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT description, in_date AS inDate, writer_hidden_flag AS writerHiddenFlag FROM letters WHERE recipient_id = ? AND delete_flag = 0 ORDER BY inDate DESC;`;

      const letters = await conn.query(query, id);
      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.realse();
    }
  }

  static async findLettersByGroup() {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = ``;

      const letters = await conn.query(query);
      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.realse();
    }
  }

  static async findRecipientByBoard(boardNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM boards WHERE no = ?;`;

      const recipientId = await conn.query(query, boardNo);

      return recipientId[0].studentId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findRecipientByComment(boardNo, commentNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM comments WHERE board_no = ? AND no = ?;`;

      const recipientId = await conn.query(query, [boardNo, commentNo]);

      return recipientId[0].studentId;
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
        'INSERT INTO letters (sender_id, recipient_id, description, board_flag, board_no, writer_hidden_flag) VALUES (?, ?, ?, 1, ?, ?);';

      const letter = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.description,
        sendInfo.boardNo,
        sendInfo.writerHiddenFlag,
      ]);

      return letter.affectedRows;
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

      const query = `INSERT INTO letters (sender_id, recipient_id, description, board_flag, board_no, writer_hidden_flag) VALUES (?, ?, ?, 0, ?, ?);`;

      const letter = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.description,
        sendInfo.boardNo,
        sendInfo.writerHiddenFlag,
      ]);

      return letter.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = LetterStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class LetterStorage {
  static async findLetterNotification(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT l.no, s.name, l.description, l.writer_hidden_flag AS writerHiddenFlag FROM letters AS l
      LEFT JOIN students as s ON sender_id = s.id
      WHERE host_id = ? AND sender_id != ? AND reading_flag = 0
      ORDER BY l.in_date DESC;`;

      const letters = await conn.query(query, [id, id]);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetters(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT l.no, s.name, l.description, l.in_date AS inDate, l.writer_hidden_flag AS writerHiddenFlag 
      FROM letters AS l
      LEFT JOIN students AS s on sender_id = s.id
      WHERE no IN (SELECT MAX(no) FROM letters
      WHERE host_id = ? AND delete_flag = 0 
      GROUP BY board_no, board_flag, writer_hidden_flag);`;

      const letters = await conn.query(query, id);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetterByNo(letterNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM letters WHERE no = ? AND delete_flag = 0;`;

      const letter = await conn.query(query, letterNo);

      return letter;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLettersByGroup(letterInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT s.name, l.sender_id AS senderId,  description, l.board_flag AS boardFlag, l.board_no AS boardNo, l.in_date AS inDate, l.writer_hidden_flag AS writerHiddenFlag
      FROM letters AS l
      JOIN students AS s ON s.id = l.sender_id OR s.id = l.recipient_id 
      WHERE l.host_id = ? AND l.board_flag = ? AND l.board_no = ? AND s.id = ? AND l.writer_hidden_flag = ? AND delete_flag = 0 ;`;

      const letters = await conn.query(query, [
        letterInfo.id,
        letterInfo.boardFlag,
        letterInfo.boardNo,
        letterInfo.otherId,
        letterInfo.writerHiddenFlag,
      ]);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
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

  static async findRecipientByLetter(letterNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT sender_id AS senderId, recipient_id AS recipientId FROM letters WHERE no = ?;`;

      const recipientInfo = await conn.query(query, letterNo);

      return recipientInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createLetter(sendInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'INSERT INTO letters (sender_id, recipient_id, host_id, description, board_flag, board_no, writer_hidden_flag) VALUES (?, ?, ?, ?, ?, ?, ?);';

      // 쪽지는 전송자와 수신자 모두 저장이 되어 있어야 각자 따로 메세지를 지울 수 있기 때문에 host_id COLUMN 값만 다르게 두번 저장
      const addLetterBySender = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.senderId,
        sendInfo.description,
        sendInfo.boardFlag,
        sendInfo.boardNo,
        sendInfo.writerHiddenFlag,
      ]);

      const addLetterByRecipeint = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.recipientId,
        sendInfo.description,
        sendInfo.boardFlag,
        sendInfo.boardNo,
        sendInfo.writerHiddenFlag,
      ]);

      return addLetterBySender.affectedRows + addLetterByRecipeint.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetterInfo(letterNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT sender_id AS senderId, recipient_id AS recipientId, board_flag AS boardFlag, board_no AS boardNo, writer_hidden_flag AS writerHiddenFlag
      FROM letters WHERE no = ?;`;

      const letterInfo = await conn.query(query, letterNo);

      return letterInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateReadingFlag(letterInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE letters SET reading_flag = 1 WHERE host_id = ? AND board_no = ? AND board_flag = ? AND writer_hidden_flag = ?;`;

      const letter = await conn.query(query, [
        letterInfo.id,
        letterInfo.boardNo,
        letterInfo.boardFlag,
        letterInfo.writerHiddenFlag,
      ]);

      return letter.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteLetterNotifications(id) {
    let conn;

    try {
      conn = await mariadb.getConnetction();

      const query = `UPDATE letters SET reading_flag = 1 WHERE host_id = ? AND reading_flag = 0;`;

      const letter = await conn.query(query, id);
      return letter.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteLetters(letterInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE letters SET delete_flag = 1 WHERE board_flag = ? AND board_no = ? AND host_id = ?;`;

      const letter = await conn.query(query, [
        letterInfo.boardFlag,
        letterInfo.boardNo,
        letterInfo.id,
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

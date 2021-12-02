'use strict';

const mariadb = require('../../../config/mariadb');

class LetterStorage {
  static async findLetterNotifications(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT l.no, s.name, l.description, l.writer_hidden_flag AS hiddenFlag, l.group_no AS groupNo FROM letters AS l
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

      const query = `SELECT l.no, s.name, l.description, group_no AS groupNo, l.in_date AS inDate, IF (sender_id = ?, l.recipient_hidden_flag, l.writer_hidden_flag) AS hiddenFlag
      FROM letters AS l
      LEFT JOIN students AS s ON IF (sender_id = ?, recipient_id = s.id, sender_id = s.id)
      WHERE no IN (SELECT MAX(no) FROM letters
      WHERE host_id = ? AND delete_flag = 0 
      GROUP BY group_no);`;

      const letters = await conn.query(query, [id, id, id]);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetterByGroupNo(groupNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT sender_id AS senderId, recipient_id AS recipientId FROM letters WHERE group_no = ? AND delete_flag = 0;`;

      const letterInfo = await conn.query(query, groupNo);

      return letterInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  // static async findRecipientByLetter(groupNo) {
  //   let conn;

  //   try {
  //     conn = await mariadb.getConnection();

  //     const query = `SELECT sender_id AS senderId, recipient_id AS recipientId FROM letters WHERE no = ?;`;

  //     const recipientInfo = await conn.query(query, groupNo);

  //     return recipientInfo[0];
  //   } catch (err) {
  //     throw err;
  //   } finally {
  //     conn?.release();
  //   }
  // }

  static async findLettersByGroup(letterInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT s.name, l.sender_id AS senderId, l.recipient_id AS recipientId, description, l.in_date AS inDate, IF (sender_id = ?, l.recipient_hidden_flag, l.writer_hidden_flag) AS hiddenFlag
      FROM letters AS l
      JOIN students AS s ON s.id = l.sender_id OR s.id = l.recipient_id 
      WHERE l.host_id = ? AND s.id = ? AND group_no = ? AND delete_flag = 0
      ORDER BY l.in_date DESC;`;

      const letters = await conn.query(query, [
        letterInfo.id,
        letterInfo.id,
        letterInfo.otherId,
        letterInfo.groupNo,
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

      const query = `SELECT student_id AS studentId FROM comments WHERE no = ?;`;

      const recipientId = await conn.query(query, [boardNo, commentNo]);

      return recipientId[0].studentId;
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
        'INSERT INTO letters (sender_id, recipient_id, host_id, description, writer_hidden_flag, recipient_hidden_flag) VALUES (?, ?, ?, ?, ?, ?);';

      // 쪽지는 전송자와 수신자 모두 저장이 되어 있어야 각자 따로 메세지를 지울 수 있기 때문에 host_id COLUMN 값만 다르게 두번 저장
      const addLetterBySender = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.senderId,
        sendInfo.description,
        sendInfo.writerHiddenFlag,
        sendInfo.recipientHiddenFlag,
      ]);

      const addLetterByRecipient = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.recipientId,
        sendInfo.description,
        sendInfo.writerHiddenFlag,
        sendInfo.recipientHiddenFlag,
      ]);

      return {
        sender: addLetterBySender.insertId,
        recipient: addLetterByRecipient.insertId,
      };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateGroupNo(sender, recipient, groupNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'UPDATE letters SET group_no = ? WHERE no = ? OR no = ?;';

      const resultSender = await conn.query(query, [
        groupNo,
        sender,
        recipient,
      ]);

      return resultSender.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetterInfo(groupNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT sender_id AS senderId, recipient_id AS recipientId, group_no AS groupNo
      FROM letters WHERE group_no = ?;`;

      const letterInfo = await conn.query(query, groupNo);

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

      const query = `UPDATE letters SET reading_flag = 1 WHERE host_id = ? AND group_no = ?;`;

      const letter = await conn.query(query, [
        letterInfo.id,
        letterInfo.groupNo,
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
      conn = await mariadb.getConnection();

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

      const query = `UPDATE letters SET delete_flag = 1 WHERE host_id = ? AND group_no = ?;`;

      const letter = await conn.query(query, [
        letterInfo.id,
        letterInfo.groupNo,
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

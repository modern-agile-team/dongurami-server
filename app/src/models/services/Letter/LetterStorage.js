'use strict';

const mariadb = require('../../../config/mariadb');

class LetterStorage {
  static async findLetterNotifications(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT l.no, s.name, l.description, l.writer_hidden_flag AS hiddenFlag, l.group_no AS groupNo FROM letters AS l
        LEFT JOIN students as s 
        ON sender_id = s.id
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

  static async deleteLetterNotifications(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE letters 
        SET reading_flag = 1 
        WHERE host_id = ? AND reading_flag = 0;`;

      const letter = await conn.query(query, [id]);

      return letter.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllLetterList(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT l.no, s.name, l.description, group_no AS groupNo, l.in_date AS inDate, IF (sender_id = ?, l.recipient_hidden_flag, l.writer_hidden_flag) AS hiddenFlag
        FROM letters AS l
        LEFT JOIN students AS s 
        ON IF (sender_id = ?, recipient_id = s.id, sender_id = s.id)
        WHERE no 
        IN (SELECT MAX(no) 
        FROM letters
        WHERE host_id = ?
        GROUP BY group_no)
        ORDER BY l.in_date DESC;`;

      const letters = await conn.query(query, [id, id, id]);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  // delete flag 보류..
  static async xxfindAllLetterList(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT l.no, s.name, l.description, group_no AS groupNo, l.in_date AS inDate, IF (sender_id = ?, l.recipient_hidden_flag, l.writer_hidden_flag) AS hiddenFlag
        FROM letters AS l
        LEFT JOIN students AS s 
        ON IF (sender_id = ?, recipient_id = s.id, sender_id = s.id)
        WHERE no 
        IN (SELECT MAX(no) 
        FROM letters
        WHERE host_id = ? AND delete_flag = 0 
        GROUP BY group_no)
        ORDER BY l.in_date DESC;`;

      const letters = await conn.query(query, [id, id, id]);

      return letters;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findLetterParticipantInfo(groupInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT sender_id AS senderId, recipient_id AS recipientId, group_no AS groupNo
        FROM letters 
        WHERE group_no = ? AND host_id = ?;`;

      const letterInfo = await conn.query(query, [
        groupInfo.groupNo,
        groupInfo.id,
      ]);

      return letterInfo[0];
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

      const query = `
        SELECT s.name, l.sender_id AS senderId, l.recipient_id AS recipientId, description, l.in_date AS inDate, IF (sender_id = ?, l.recipient_hidden_flag, l.writer_hidden_flag) AS otherHiddenFlag, IF (sender_id = ?, l.writer_hidden_flag, l.recipient_hidden_flag) AS myHiddenFlag
        FROM letters AS l
        JOIN students AS s
        ON s.id = l.sender_id OR s.id = l.recipient_id 
        WHERE l.host_id = ? AND s.id = ? AND group_no = ? AND delete_flag = 0
        ORDER BY l.in_date DESC;`;

      const letters = await conn.query(query, [
        letterInfo.id,
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

      const query = `
        SELECT student_id AS studentId 
        FROM boards 
        WHERE no = ?;`;

      const recipientId = await conn.query(query, [boardNo]);

      return recipientId[0].studentId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findRecipientByComment(commentNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT student_id AS studentId 
        FROM comments 
        WHERE no = ?;`;

      const recipientId = await conn.query(query, [commentNo]);

      return recipientId[0].studentId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByGroupNo(sendInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT group_no AS groupNo 
        FROM letters 
        WHERE host_id = ? AND recipient_id = ? AND writer_hidden_flag = ? AND recipient_hidden_flag = ? 
        LIMIT 1;`;

      const groupNo = await conn.query(query, [
        sendInfo.senderId,
        sendInfo.recipientId,
        sendInfo.writerHiddenFlag,
        sendInfo.recipientHiddenFlag,
      ]);

      return groupNo;
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

      const query = `
        INSERT INTO letters (sender_id, recipient_id, host_id, description, writer_hidden_flag, recipient_hidden_flag) 
        VALUES (?, ?, ?, ?, ?, ?)`;

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
        senderInsertNo: addLetterBySender.insertId,
        recipientInsertNo: addLetterByRecipient.insertId,
      };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateGroupNo(letterGroupInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE letters 
        SET group_no = ? 
        WHERE no = ? OR no = ?;`;

      const resultSender = await conn.query(query, [
        letterGroupInfo.groupNo,
        letterGroupInfo.senderInsertNo,
        letterGroupInfo.recipientInsertNo,
      ]);

      return resultSender.affectedRows;
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

      const query = `
        UPDATE letters 
        SET reading_flag = 1 
        WHERE host_id = ? AND group_no = ?;`;

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

  static async deleteLettersByGroupNo(letterInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM letters 
        WHERE host_id = ? AND group_no = ?;`;

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

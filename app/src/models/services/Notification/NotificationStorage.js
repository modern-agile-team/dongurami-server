'use strict';

const mariadb = require('../../../config/mariadb');

class NotificationStorage {
  static async findAllById(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no, no.sender, no.content, no.title, no.url, no.notification_category_no AS notiCategoryNum, 
        no.in_date AS inDate FROM notifications AS no 
        WHERE no.recipient = (SELECT name FROM students WHERE id = ?) AND no.reading_flag = 0
        ORDER BY inDate DESC;`;

      const notifications = await conn.query(query, [studentId]);

      return { success: true, notifications };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllMemberInfoByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name, s.id 
        FROM members AS m 
        JOIN students AS s 
        ON m.student_id = s.id 
        WHERE m.club_no = ?;`;

      const members = await conn.query(query, clubNum);

      return members;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findClubInfoByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name, s.id, c.name AS clubName 
        FROM clubs AS c 
        JOIN students AS s 
        ON c.leader = s.id 
        WHERE c.no = ?;`;

      const club = await conn.query(query, clubNum);

      return {
        clubName: club[0].clubName,
        leaderName: club[0].name,
        leaderId: club[0].id,
      };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createNotification(notificationInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO notifications (sender, recipient, recipient_id, url, notification_category_no, title, content) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        notificationInfo.senderName,
        notificationInfo.recipientName,
        notificationInfo.recipientId,
        notificationInfo.url,
        notificationInfo.notiCategoryNum,
        notificationInfo.title,
        notificationInfo.content,
      ]);
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOneByNotificationNum(notificationNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'UPDATE notifications SET reading_flag = 1 WHERE no = ?;';

      const notification = await conn.query(query, notificationNum);

      if (notification.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateAllById(studentName) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE notifications SET reading_flag = 1 WHERE recipient = ?;';

      const notification = await conn.query(query, studentName);

      if (notification.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllStudentNameAndId() {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id, name FROM students;`;

      const students = await conn.query(query);

      return students;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findBoardInfoByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name, s.id, b.title 
        FROM boards AS b 
        JOIN students AS s 
        ON b.student_id = s.id 
        WHERE b.no = ?;`;

      const board = await conn.query(query, [boardNum]);

      const recipient = {
        id: board[0].id,
        name: board[0].name,
        title: board[0].title,
      };

      return recipient;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByCmtNum(cmtNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name, s.id, c.description  
        FROM comments AS c
        JOIN students AS s 
        ON c.student_id = s.id 
        WHERE c.no = ?;`;

      const comment = await conn.query(query, [cmtNum]);

      const recipientInfo = {
        id: comment[0].id,
        name: comment[0].name,
        description: comment[0].description,
      };

      return recipientInfo;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findApplicantNameByClubNumAndId(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT s.name FROM applicants AS a JOIN students AS s ON a.student_id = s.id WHERE a.student_id = ? AND a.club_no = ?;';

      const applicant = await conn.query(query, [
        userInfo.id,
        userInfo.clubNum,
      ]);

      return applicant[0].name;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findRecipientNameByCmtAndBoardNum(cmtNum, boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT DISTINCT s.name, s.id, c.description FROM comments AS c 
        JOIN students AS s ON c.student_id = s.id 
        WHERE c.board_no = ? AND c.group_no = ?;`;

      const recipients = await conn.query(query, [boardNum, cmtNum]);

      return recipients;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = NotificationStorage;

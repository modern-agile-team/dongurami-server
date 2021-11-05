'use strict';

const mariadb = require('../../../config/mariadb');

class NotificationStorage {
  static async findAllById(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no, no.sender, no.url, no.notification_category_no AS notiCategoryNum, 
        no.in_date AS inDate FROM notifications AS no 
        WHERE no.recipient = (SELECT name FROM students WHERE id = ?) AND no.reading_flag = 0
        ORDER BY inDate DESC;`;

      const notifications = await conn.query(query, studentId);

      return { success: true, notifications };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT s.name FROM members AS m JOIN students AS s ON m.student_id = s.id WHERE m.club_no = ?;';

      const members = await conn.query(query, clubNum);

      const studentNames = [];

      members.forEach((member) => {
        studentNames.push(member.name);
      });

      return studentNames;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createCmtNotification(notificationInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO notifications (sender, recipient, url, notification_category_no, title, content) VALUES (?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        notificationInfo.senderName,
        notificationInfo.recipientName,
        notificationInfo.url,
        notificationInfo.notiCategoryNum,
        notificationInfo.title,
        notificationInfo.content,
      ]);

      return true;
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

      const query = `INSERT INTO notifications (sender, recipient, url, notification_category_no, title, content) 
      VALUES (?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        notificationInfo.senderName,
        notificationInfo.recipientName,
        notificationInfo.url,
        notificationInfo.notiCategoryNum,
        notificationInfo.title,
        notificationInfo.content,
      ]);

      return true;
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

  static async updateAllById(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE notifications SET reading_flag = 1 WHERE recipient_id = ?;';

      const notification = await conn.query(query, studentId);

      if (notification.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'SELECT name FROM clubs WHERE no = ?;';

      const club = await conn.query(query, clubNum);

      return club[0].name;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = NotificationStorage;

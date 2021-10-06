'use strict';

const mariadb = require('../../../config/mariadb');

class NotificationStorage {
  static async findAllById(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no.no AS notificationNum, no.sender_id AS senderId, 
        no.url, no.notification_category_no AS notificationCategoryNum, 
        no.in_date AS inDate FROM notifications AS no 
        WHERE no.recipient_id=(SELECT id FROM students WHERE id = ?)
        AND no.reading_flag = 0
        ORDER BY inDate DESC
        LIMIT 10;`;
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
        'SELECT student_id AS studentId FROM members WHERE club_no = ?;';
      const members = await conn.query(query, clubNum);
      const studentIds = [];

      members.forEach((member) => {
        studentIds.push(member.studentId);
      });

      return studentIds;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createByIdAndTitle(notificationInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO notifications (sender_id, recipient_id, url, notification_category_no, title, content) 
      VALUES (?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        notificationInfo.senderId,
        notificationInfo.recipientId,
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

  static async createByIdAndClubName(notificationInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO notifications (sender_id, recipient_id, url, notification_category_no, title, content) 
      VALUES (?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        notificationInfo.senderId,
        notificationInfo.recipientId,
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
}

module.exports = NotificationStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class NotificationStorage {
  static async findAllById(studentId) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = `SELECT no.no AS notificationNum, no.sender_id AS senderId, 
        bo.title, no.url, no.reading_flag AS readingFlag, no.in_date AS inDate 
        FROM notifications AS no 
        JOIN board AS bo
        ON no.board_num = bo.no
        WHERE no.recipient_id=(SELECT id FROM students WHERE id = ?)
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

  static async updateReadFlagByNotificationNum(notificationNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'UPDATE read_flag SET notifications WHERE no = ?;';

      const notification = await conn.query(query, notificationNum);

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

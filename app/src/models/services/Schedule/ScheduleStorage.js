'use strict';

const mariadb = require('../../../config/mariadb');

class ScheduleStorage {
  static async existClub(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(query, clubNum);

      return club[0];
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

      const query = `SELECT no, color_code AS colorCode, title, start_date AS startDate, end_date AS endDate, important 
      FROM schedules
      WHERE LEFT(start_date, 7) = LEFT(NOW(), 7) OR LEFT(end_date, 7) = LEFT(NOW(), 7) AND club_no = ?
      ORDER BY start_date;`;

      const result = await conn.query(query, clubNum);

      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByDate(scheduleInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no, color_code AS colorCode, title, start_date AS startDate, end_date AS endDate, important 
      FROM schedules 
      WHERE club_no = ? AND LEFT(start_date, 7) = ? OR LEFT(end_date, 7) = ?
      ORDER BY start_date;`;
      const result = await conn.query(query, [
        scheduleInfo.clubNum,
        scheduleInfo.date,
        scheduleInfo.date,
      ]);

      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createSchedule(scheduleInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO schedules (club_no, student_id, color_code, title, start_date, end_date)
      VALUE (?, ?, ?, ?, ?, ?);`;

      const schedule = await conn.query(query, [
        scheduleInfo.clubNum,
        scheduleInfo.studentId,
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
      ]);

      return schedule.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateSchedule(scheduleInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE schedules SET color_code = ?, title = ?, start_date = ?, end_date = ? WHERE no = ?;`;
      const schedule = await conn.query(query, [
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
        scheduleInfo.no,
      ]);

      return schedule.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyImportant(scheduleInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE schedules SET important = ? WHERE no = ?;`;
      const important = await conn.query(query, [
        scheduleInfo.important,
        scheduleInfo.no,
      ]);

      return important.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteSchedule(no) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM schedules WHERE no = ?;`;
      const schedule = await conn.query(query, no);

      return schedule.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ScheduleStorage;

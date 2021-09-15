'use strict';

const mariadb = require('../../../config/mariadb');

class ScheduleStorage {
  static async existClub(clubNum) {
    const conn = await mariadb.getConnection();
    try {
      const query = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(query, clubNum);

      if (club[0] === undefined) {
        return false;
      }
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();

    try {
      const query = `SELECT no, color_code AS colrCode, title, start_date AS startDate, end_date AS endDate, period, important 
      FROM schedules
      WHERE LEFT(start_date, 7) = LEFT(NOW(), 7) AND club_no = ?
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
    const conn = await mariadb.getConnection();

    try {
      const query = `SELECT no, color_code AS colorCode, title, start_date AS startDate, end_date AS endDate, period, important 
      FROM schedules 
      WHERE club_no = ? AND LEFT(start_date, 7) = ?
      ORDER BY start_date;`;

      const result = await conn.query(query, [
        scheduleInfo.clubNum,
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
    const conn = await mariadb.getConnection();

    try {
      const query = `INSERT INTO schedules (club_no, student_id, color_code, title, start_date, end_date, period)
      VALUE (?, ?, ?, ?, ?, ?, ?);`;

      await conn.query(query, [
        scheduleInfo.clubNum,
        scheduleInfo.studentId,
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
        scheduleInfo.period,
      ]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateSchedule(scheduleInfo) {
    const conn = await mariadb.getConnection();

    try {
      const query = `UPDATE schedules SET color_code = ?, title = ?, start_date = ?, end_date = ?, period = ? WHERE no = ?;`;

      await conn.query(query, [
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
        scheduleInfo.period,
        scheduleInfo.no,
      ]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyImportant(scheduleInfo) {
    const conn = await mariadb.getConnection();

    try {
      const query = `UPDATE schedules SET important = ? WHERE no = ?;`;

      await conn.query(query, [scheduleInfo.important, scheduleInfo.no]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteSchedule(no) {
    const conn = await mariadb.getConnection();

    try {
      const query = `DELETE FROM schedules WHERE no = ?;`;

      await conn.query(query, no);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ScheduleStorage;

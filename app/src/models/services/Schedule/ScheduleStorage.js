'use strict';

const mariadb = require('../../../config/mariadb');

class ScheduleStorage {
  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();

    try {
      const findScheduls = `SELECT no, color_code AS colrCode, title, start_date AS startDate, end_date AS endDate, period, important 
      FROM schedules
      WHERE LEFT(start_date,7) = LEFT(NOW(),7) AND club_no = ?
      ORDER BY start_date;`;
      const existClub = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(existClub, clubNum);

      if (club[0] === undefined) {
        return { success: false, result: '존재하지 않는 동아리입니다.' };
      }

      const result = await conn.query(findScheduls, clubNum);

      return { success: true, result };
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

      return true;
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

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateImportant(scheduleInfo) {
    const conn = await mariadb.getConnection();

    try {
      const query = `UPDATE schedules SET important = ? WHERE no =?;`;

      await conn.query(query, [scheduleInfo.important, scheduleInfo.no]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ScheduleStorage;

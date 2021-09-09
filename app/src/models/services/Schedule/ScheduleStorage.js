'use strict';

const mariadb = require('../../../config/mariadb');

class ScheduleStorage {
  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();

    try {
      const query = `SELECT no, color_code AS colrCode, title, start_date AS startDate, end_date AS endDate, period, important 
      FROM schedules
      WHERE LEFT(start_date,7) = LEFT(NOW(),7) AND club_no = ?
      ORDER BY start_date;`;
      const existClub = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(existClub, clubNum);

      if (club[0] === undefined) {
        return { success: false, result: '존재하지 않는 동아리입니다.' };
      }

      const result = await conn.query(query, clubNum);

      return { success: true, result };
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
      WHERE club_no = ? AND LEFT(start_date, 7) = ?;`;
      const existClub = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(existClub, scheduleInfo.clubNum);

      if (club[0] === undefined) {
        return { success: false, result: '존재하지 않는 동아리입니다.' };
      }

      const result = await conn.query(query, [
        scheduleInfo.clubNum,
        scheduleInfo.date,
      ]);

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
      const query = `UPDATE schedules SET color_code = ?, title = ?, start_date = ?, end_date = ?, period = ? WHERE no = ? AND club_no = ?;`;

      await conn.query(query, [
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
        scheduleInfo.period,
        scheduleInfo.no,
        scheduleInfo.clubNum,
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
      const query = `UPDATE schedules SET important = ? WHERE no = ?;`;
      const existSchedule =
        'SELECT no FROM schedules WHERE no = ? AND club_no = ?;';
      const schedule = await conn.query(existSchedule, [
        scheduleInfo.no,
        scheduleInfo.clubNum,
      ]);

      // 해당 동아리에 해당하는 일정이 없을 때
      if (schedule[0] === undefined) {
        return { success: false, result: '존재하지 않는 일정입니다.' };
      }

      await conn.query(query, [scheduleInfo.important, scheduleInfo.no]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteSchedule(scheduleInfo) {
    const conn = await mariadb.getConnection();
    const existSchedule =
      'SELECT no FROM schedules WHERE no = ? AND club_no = ?;';
    const schedule = await conn.query(existSchedule, [
      scheduleInfo.no,
      scheduleInfo.clubNum,
    ]);

    // 해당 동아리에 해당하는 일정이 없을 때
    if (schedule[0] === undefined) {
      return { success: false, result: '존재하지 않는 일정입니다.' };
    }

    try {
      const query = `DELETE FROM schedules WHERE no = ?;`;

      await conn.query(query, scheduleInfo.no);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ScheduleStorage;

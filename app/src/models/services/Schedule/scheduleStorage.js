'use strict';

const mariadb = require('../../../config/mariadb');

class scheduleStorage {
  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();

    try {
      const findScheduls =
        'SELECT color_code AS colorCode, title, description, start_date AS startDate, end_date AS endDate, important FROM schedules WHERE club_no = ?;';
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
      const query = `INSERT INTO schedules (club_no, student_id, color_code, title, description, start_date, end_date, important)
      VALUE (?, ?, ?, ?, ?, ?, ?, ?)`;

      await conn.query(query, [
        scheduleInfo.clubNum,
        scheduleInfo.studentId,
        scheduleInfo.colorCode,
        scheduleInfo.title,
        scheduleInfo.description,
        scheduleInfo.startDate,
        scheduleInfo.endDate,
        scheduleInfo.important,
      ]);

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = scheduleStorage;

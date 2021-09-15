'use strict';

const mariadb = require('../../../config/mariadb');

class adminoOptionStroage {
  static async findOneById(adminInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = `select student_id from members where club_no = ? AND student_id = ? AND join_admin_flag = 1;`;

      const id = await conn.query(query, [adminInfo.clubNum, adminInfo.id]);

      return { success: true, id };
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

      const memberAndAuthQuery = `SELECT s.name, m.club_no, m.join_admin_flag, m.board_admin_flag FROM members AS m
      JOIN students AS s ON s.id = m.student_id AND m.club_no = ?;`;
      const leaderQuery =
        'select students.name from students JOIN clubs ON clubs.leader = students.name AND clubs.no = ?;';

      const memberAndAuthList = await conn.query(memberAndAuthQuery, clubNum);
      const leader = await conn.query(leaderQuery, clubNum);

      return {
        success: true,
        leader: leader[0].name,
        memberAndAuthList,
      };
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
        'select students.name, club_admin_auth.function_no AS functionNum FROM students join club_admin_auth ON students.id = club_admin_auth.student_id AND club_admin_auth.club_no = ? ;';

      const functionList = await conn.query(query, clubNum);

      return { findFunctionSuccess: true, functionList };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = adminoOptionStroage;

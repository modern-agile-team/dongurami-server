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

      const memberAndAuthQuery = `select students.name, members.club_no, members.join_admin_flag, members.board_admin_flag from members join students on students.id = members.student_id AND members.club_no = ?;`;
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

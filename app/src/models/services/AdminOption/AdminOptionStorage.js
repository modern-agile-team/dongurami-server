'use strict';

const mariadb = require('../../../config/mariadb');

class adminoOptionStroage {
  static async findFunctionById(payloadId) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT club_admin_auth.student_id FROM function_categories JOIN club_admin_auth ON club_admin_auth.student_id = ?, AND function_categories.no = 1;';

      const id = await conn.query(query, payloadId);

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
      const membersQuery =
        'select students.name FROM students join members ON members.club_no = ? AND students.id = members.student_id;';
      const leaderQuery = 'select clubs.leader FROM clubs WHERE clubs.no = ?;';

      const memberList = await conn.query(membersQuery, clubNum);
      const leader = await conn.query(leaderQuery, clubNum);
      const members = [];

      for (let i = 0; i < memberList.length; i += 1) {
        members.push(memberList[i].name);
      }

      return { findNameSuccess: true, leader: leader[0].leader, members };
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

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
      const memberAndAuthQuery = `SELECT students.name, students.id, IFNULL(function_categories.name, '권한 없음') AS functionName FROM students 
        JOIN members ON members.club_no = ? AND students.id = members.student_id 
        LEFT JOIN club_admin_auth ON club_admin_auth.club_no = members.club_no 
        AND club_admin_auth.student_id = members.student_id 
        LEFT JOIN function_categories ON club_admin_auth.function_no = function_categories.no;`;
      const leaderQuery =
        'select students.name from students JOIN clubs ON clubs.leader = students.name AND clubs.no = ?;';

      const memberAndAuthList = await conn.query(memberAndAuthQuery, clubNum);
      const leader = await conn.query(leaderQuery, clubNum);

      return {
        findNameSuccess: true,
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

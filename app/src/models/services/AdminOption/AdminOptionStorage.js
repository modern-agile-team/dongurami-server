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

      const memberAndAuthQuery = `SELECT s.name, s.id, m.club_no, m.join_admin_flag, m.board_admin_flag FROM members AS m
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

  static async findLeaderByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = 'SELECT leader FROM clubs WHERE club_no = ?;';
      const leader = await conn.query(query, clubNum);

      return leader;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  // static async updateAdminOptionById(adminOption) {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();

  //     let query = 'UPDATE members SET';

  //     await conn.query(`${query}`);

  //   }
  // }
}

module.exports = adminoOptionStroage;

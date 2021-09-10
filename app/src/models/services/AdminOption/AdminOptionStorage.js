'use strict';

const mariadb = require('../../../config/mariadb');

class adminoOptionStroage {
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

      return { success: true, leader: leader[0].leader, members };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = adminoOptionStroage;

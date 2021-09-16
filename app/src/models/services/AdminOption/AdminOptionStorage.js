'use strict';

const mariadb = require('../../../config/mariadb');

class adminoOptionStroage {
  static async findOneById(adminInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id FROM members WHERE club_no = ? AND student_id = ? AND join_admin_flag = 1;`;

      const id = await conn.query(query, [adminInfo.clubNum, adminInfo.id]);

      return { success: true, id: id[0].student_id };
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

      const memberAndAuthQuery = `SELECT s.name, s.id, m.join_admin_flag AS joinAdminFlag, m.board_admin_flag AS boarAdminFlag 
        FROM members AS m JOIN students AS s ON s.id = m.student_id AND m.club_no = ?;`;
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

      const query = 'SELECT leader FROM clubs WHERE no = ?;';
      const leader = await conn.query(query, clubNum);

      return leader[0].leader;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateNewLeaderByClubNum(leaderInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = 'UPDATE clubs SET leader = ? WHERE no = ?;';

      await conn.query(query, [leaderInfo.newLeader, leaderInfo.clubNum]);
      console.log(
        await conn.query(query, [leaderInfo.newLeader, leaderInfo.clubNum])
      );
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateLeaderAdminOptionByClubNum(leaderInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE members SET join_admin_flag = ?, board_admin_flag = ? WHERE club_no = ? AND student_id = ?';

      await conn.query(query, [1, 1, leaderInfo.clubNum, leaderInfo.newLeader]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateAdminOptionById(adminInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      let query = '';

      adminInfo.adminOption.forEach((option) => {
        query += `UPDATE members SET join_admin_flag = "${option.joinAdminFlag}", board_admin_flag = "${option.boardAdminFlag}"
          WHERE student_id = "${option.studentId}" AND club_no = "${adminInfo.clubNum}";`;
      });

      await conn.query(`${query}`);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = adminoOptionStroage;

'use strict';

const mariadb = require('../../../config/mariadb');

class AdminoOptionStorage {
  static async findOneById(adminInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId FROM members 
        WHERE club_no = ? AND student_id = ? AND join_admin_flag = 1;`;

      const member = await conn.query(query, [adminInfo.clubNum, adminInfo.id]);

      if (!member[0]) return false;
      return member[0].studentId;
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

      const memberAndAuthQuery = `SELECT s.name, s.id, m.join_admin_flag AS joinAdminFlag, 
        m.board_admin_flag AS boardAdminFlag FROM members AS m JOIN students AS s 
        ON s.id = m.student_id AND m.club_no = ?;`;
      const leaderAndClubNameQuery = `SELECT s.name AS leader , c.name FROM students AS s 
        JOIN clubs AS c ON c.leader = s.id AND c.no = ?;`;

      const memberAndAuthList = await conn.query(memberAndAuthQuery, clubNum);

      const leaderAndClubName = await conn.query(
        leaderAndClubNameQuery,
        clubNum
      );

      return {
        success: true,
        leader: leaderAndClubName[0].leader,
        clubName: leaderAndClubName[0].name,
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

      const updateLeader = await conn.query(query, [
        leaderInfo.newLeader,
        leaderInfo.clubNum,
      ]);

      if (updateLeader.affectedRows === 1) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateLeaderAdminOptionById(leaderInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE members SET join_admin_flag = ?, board_admin_flag = ? WHERE club_no = ? AND student_id = ?;';

      const adminOption = await conn.query(query, [
        1,
        1,
        leaderInfo.clubNum,
        leaderInfo.newLeader,
      ]);

      if (adminOption.affectedRows === 1) return true;
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
          WHERE student_id = "${option.id}" AND club_no = "${adminInfo.clubNum}";`;
      });

      const updateAdminOption = await conn.query(`${query}`);

      for (let i = 0; i < updateAdminOption.length; i += 1) {
        if (!updateAdminOption[i].affectedRows) return false;
      }

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteMemberById(memberInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'DELETE FROM members WHERE club_no = ? AND student_id = ?;';

      const deleteMember = await conn.query(query, [
        memberInfo.clubNum,
        memberInfo.memberId,
      ]);

      if (!deleteMember.affectedRows) return false;
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateReadingFlagById(memberInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE applicants SET reading_flag = 2 WHERE club_no = ? AND student_id = ?;`;

      const updateApplicant = await conn.query(query, [
        memberInfo.clubNum,
        memberInfo.memberId,
      ]);

      if (!updateApplicant.affectedRows) return false;
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = AdminoOptionStorage;

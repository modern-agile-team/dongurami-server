'use strict';

const mariadb = require('../../../config/mariadb');

class AdminoOptionStorage {
  static async findOneById(adminInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT student_id AS studentId 
        FROM members 
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

  static async findBoardAdminFlag(clubNum, id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT board_admin_flag AS boardAdminFlag 
        FROM members 
        WHERE club_no = ? AND student_id = ?;`;

      const boardFlag = await conn.query(query, [clubNum, id]);

      return boardFlag[0].boardAdminFlag;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findMemberAndAuthByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name, s.id, s.grade, s.major, s.gender, s.phone_number AS phoneNum, m.join_admin_flag AS joinAdminFlag, m.board_admin_flag AS boardAdminFlag 
        FROM members AS m 
        JOIN students AS s 
        ON s.id = m.student_id AND m.club_no = ?;`;

      const memberAndAuthList = await conn.query(query, [clubNum]);

      return memberAndAuthList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findClubInfoByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.name AS leader , c.name 
        FROM students AS s 
        JOIN clubs AS c 
        ON c.leader = s.id AND c.no = ?;`;

      const leaderAndClubName = await conn.query(query, [clubNum]);

      return {
        leader: leaderAndClubName[0].leader,
        clubName: leaderAndClubName[0].name,
      };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findApplicantInfoByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT app.in_date AS inDate, s.name, s.id, s.major, s.grade, s.gender, s.phone_number AS phoneNum 
        FROM students AS s 
        JOIN applicants AS app 
        ON app.club_no = ? AND app.student_id = s.id AND app.reading_flag = 0;`;

      const applicantInfo = await conn.query(query, [clubNum]);

      return applicantInfo;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findQuestionsAnswersByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT app.student_id AS id, q.description AS question, a.description AS answer
        FROM applicants AS app 
        JOIN answers AS a 
        ON a.student_id = app.student_id AND app.club_no = ? AND app.reading_flag = 0 
        JOIN questions AS q
        ON a.question_no = q.no AND app.club_no = q.club_no 
        ORDER BY id`;

      const questionAnswerInfo = await conn.query(query, [clubNum]);

      return questionAnswerInfo;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findApplicantsByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT student_id AS id 
        FROM applicants 
        WHERE reading_flag = 0 AND club_no = ?;`;

      const applicants = await conn.query(query, [clubNum]);

      return applicants;
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

      const query = `
        SELECT leader 
        FROM clubs 
        WHERE no = ?;`;

      const leader = await conn.query(query, [clubNum]);

      return leader[0].leader;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createMemberById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO members (student_id, club_no, join_admin_flag, board_admin_flag) 
        VALUES (?, ?, 0, 0);`;

      const updateMember = await conn.query(query, [
        userInfo.applicant,
        userInfo.clubNum,
      ]);

      return updateMember.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateAcceptedApplicantById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE applicants 
        SET reading_flag = 1 
        WHERE club_no = ? AND student_id = ?;`;

      const approvedApplicant = await conn.query(query, [
        userInfo.clubNum,
        userInfo.applicant,
      ]);

      return approvedApplicant.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateRejectedApplicantById(applicantInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE applicants 
        SET reading_flag = 2 
        WHERE club_no = ? AND student_id = ?;`;

      const updateRejectedApplicant = await conn.query(query, [
        applicantInfo.clubNum,
        applicantInfo.applicantId,
      ]);

      return updateRejectedApplicant.affectedRows;
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

      const query = `
        UPDATE clubs 
        SET leader = ? 
        WHERE no = ?;`;

      const updateLeader = await conn.query(query, [
        leaderInfo.newLeader,
        leaderInfo.clubNum,
      ]);

      return updateLeader.affectedRows;
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

      const query = `
        UPDATE members 
        SET join_admin_flag = 1, board_admin_flag = 1 
        WHERE club_no = ? AND student_id = ?;`;

      const adminOption = await conn.query(query, [
        leaderInfo.clubNum,
        leaderInfo.newLeader,
      ]);

      return adminOption.affectedRows;
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
        query += `
          UPDATE members 
          SET join_admin_flag = "${option.joinAdminFlag}", board_admin_flag = "${option.boardAdminFlag}"
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

      const query = `
        DELETE FROM members 
        WHERE club_no = ? AND student_id = ?;`;

      const deleteMember = await conn.query(query, [
        memberInfo.clubNum,
        memberInfo.memberId,
      ]);

      return deleteMember.affectedRows;
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

      const query = `
        UPDATE applicants 
        SET reading_flag = 2 
        WHERE club_no = ? AND student_id = ?;`;

      const updateApplicant = await conn.query(query, [
        memberInfo.clubNum,
        memberInfo.memberId,
      ]);

      return updateApplicant.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = AdminoOptionStorage;

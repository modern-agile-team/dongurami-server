'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findAllByClubNum(clubInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const client =
        'SELECT id, name, major, grade, gender, phone_number AS phoneNumber FROM students WHERE id = ?;';
      const leader = 'SELECT leader FROM clubs WHERE no = ?;'; // 동아리 회장만 수정 가능 -> 동아리 회장 학번 조회
      const qustion =
        'SELECT no, description FROM questions WHERE club_no = ?;';
      const clubLeader = await conn.query(leader, clubInfo.clubNum);

      if (clubLeader[0] === undefined) {
        // 동아리 존재 x
        return { success: false };
      }

      const clientInfo = await conn.query(client, clubInfo.id);
      const questions = await conn.query(qustion, clubInfo.clubNum);

      return { success: true, clubLeader, clientInfo, questions };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createQuestion(questionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'INSERT INTO questions (club_no, description) VALUE (?, ?);';
      const question = await conn.query(query, [
        questionInfo.clubNum,
        questionInfo.description,
      ]);

      return question.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateQuestion(questionInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'UPDATE questions SET description = ? WHERE no = ?;';
      const question = await conn.query(query, [
        questionInfo.description,
        questionInfo.no,
      ]);

      return question.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteQuestion(no) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'DELETE FROM questions WHERE no = ?;';
      const question = await conn.query(query, no);

      return question.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findApplicant(applicantInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const applicant = `SELECT reading_flag AS readingFlag FROM applicants WHERE club_no = ? AND student_id = ? ORDER BY no DESC;`;
      const isApplicant = await conn.query(applicant, [
        applicantInfo.clubNum,
        applicantInfo.id,
      ]);

      return isApplicant[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createBasicAnswer(answerInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const studentInfo = `UPDATE students SET grade = ?, gender = ?, phone_number = ? WHERE id = ?;`;
      const basic = await conn.query(studentInfo, [
        answerInfo.grade,
        answerInfo.gender,
        answerInfo.phoneNum,
        answerInfo.id,
      ]);

      return basic.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createExtraAnswer(answerInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      let answer = `INSERT INTO answers (question_no, student_id, description) VALUES`;

      answerInfo.extra.forEach((x, idx) => {
        if (idx) {
          answer += `, ("${x.no}", "${answerInfo.id}", "${x.description}")`;
        } else answer += `("${x.no}", "${answerInfo.id}", "${x.description}")`;
      });
      answer += ';';

      const extra = await conn.query(`${answer}`);

      return extra.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateExtraAnswer(id, answerInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      let query = '';

      answerInfo.extra.forEach((answer) => {
        query += `UPDATE answers SET description = "${answer.description}" WHERE question_no = ${answer.no} AND student_id = "${id}";`;
      });

      const result = await conn.query(`${query}`);

      let updates = 0;

      result.forEach((v) => {
        updates += v.affectedRows;
      });

      return updates;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createApplicant(applicantInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO applicants (club_no, student_id) VALUE (?, ?);`;
      const result = await conn.query(query, [
        applicantInfo.clubNum,
        applicantInfo.id,
      ]);

      return result.affectedRows;
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

      const applicantInfoQuery = `SELECT app.in_date AS inDate, s.name, s.id, s.major, 
        s.grade, s.gender, s.phone_number AS phoneNum 
        FROM students AS s JOIN applicants AS app ON app.club_no = ?
        AND app.student_id = s.id AND app.reading_flag = 0 ORDER BY app.in_date ASC, app.student_id;`;
      const questionAnswerQuery = `SELECT app.student_id AS id, q.description AS question, 
        a.description AS answer 
        FROM answers AS a JOIN applicants AS app ON a.student_id = app.student_id 
        AND app.club_no = ? AND app.reading_flag = 0 JOIN questions AS q 
        ON a.question_no = q.no AND app.club_no = q.club_no ORDER BY app.in_date ASC, app.student_id ASC;`;

      const applicantInfo = await conn.query(applicantInfoQuery, clubNum);
      const questionsAnswers = await conn.query(questionAnswerQuery, clubNum);

      return {
        success: true,
        applicantInfo,
        questionsAnswers,
      };
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

      const query =
        'UPDATE applicants SET reading_flag = 1 WHERE club_no = ? AND student_id = ?;';

      const approvedApplicant = await conn.query(query, [
        userInfo.clubNum,
        userInfo.applicant,
      ]);

      if (approvedApplicant.affectedRows) return true;
      return false;
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

      const query =
        'INSERT INTO members (student_id, club_no, join_admin_flag, board_admin_flag) VALUES (?, ?, 0, 0);';

      const updateMember = await conn.query(query, [
        userInfo.applicant,
        userInfo.clubNum,
      ]);

      if (updateMember.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateRejectedApplicantById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE applicants SET reading_flag = 2 WHERE club_no = ? AND student_id = ?;';

      const updateRejectedApplicant = await conn.query(query, [
        userInfo.clubNum,
        userInfo.applicant,
      ]);

      if (updateRejectedApplicant.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByApplicantIdAndClubNum(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT s.name FROM applicants AS a JOIN students AS s ON a.student_id = s.id WHERE a.student_id = ? AND a.club_no = ?;';

      const applicant = await conn.query(query, [
        userInfo.applicant,
        userInfo.clubNum,
      ]);

      return applicant[0].name;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ApplicationStorage;

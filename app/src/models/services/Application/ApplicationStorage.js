'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findAllByClubNum(clubInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const major = 'SELECT major FROM students WHERE id = ?;';
      const leader = 'SELECT leader FROM clubs WHERE no = ?;'; // 동아리 회장만 수정 가능 -> 동아리 회장 학번 조회
      const qustion =
        'SELECT no, description FROM questions WHERE club_no = ?;';
      const clubLeader = await conn.query(leader, clubInfo.clubNum);

      if (clubLeader[0] === undefined) {
        // 동아리 존재 x
        return { success: false };
      }

      const clientMajor = await conn.query(major, clubInfo.id);
      const questions = await conn.query(qustion, clubInfo.clubNum);

      return { success: true, clubLeader, clientMajor, questions };
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

      await conn.query(query, [questionInfo.clubNum, questionInfo.description]);

      return;
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

      await conn.query(query, [questionInfo.description, questionInfo.no]);

      return;
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

      await conn.query(query, no);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createAnswer(answerInfo) {
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

      if (basic.affectedRows === 1) {
        // 추가 질문이 있을시 -> 없을시엔 answers table에 row 추가 x, applicants table row 추가 o
        if (answerInfo.extra.length !== 0) {
          let answer = `INSERT INTO answers (question_no, student_id, description) VALUES`;

          answerInfo.extra.forEach((x, idx) => {
            if (idx === 0)
              answer += ` ("${x.no}", "${answerInfo.id}", "${x.description}")`;
            else
              answer += `, ("${x.no}", "${answerInfo.id}", "${x.description}")`;
          });
          answer += ';';

          const extra = await conn.query(`${answer}`);

          if (extra.affectedRows === answerInfo.extra.length) return true;
          return false;
        }
        return true;
      }
      return false;
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
}

module.exports = ApplicationStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findAllByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const leader = 'SELECT leader FROM clubs WHERE no = ?;'; // 동아리 회장만 수정 가능 -> 동아리 회장 학번 조회
      const qustion =
        'SELECT no, description FROM questions WHERE club_no = ?;';
      const clubLeader = await conn.query(leader, clubNum);

      if (clubLeader[0] === undefined) {
        // 동아리 존재 x
        return { success: false };
      }

      const questions = await conn.query(qustion, clubNum);

      return { success: true, clubLeader, questions };
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
      const studentInfo = `UPDATE students SET major = ?, grade = ?, gender = ?, phone_number = ? WHERE id = ?;`;
      let answer = `INSERT INTO answers (question_no, student_id, description) VALUES`;

      answerInfo.extra.forEach((x, idx) => {
        if (idx === 0)
          answer += ` ("${x.no}", "${answerInfo.id}", "${x.description}")`;
        else answer += `, ("${x.no}", "${answerInfo.id}", "${x.description}")`;
      });
      answer += ';';

      await conn.query(`${answer}`);

      conn.query(studentInfo, [
        answerInfo.major,
        answerInfo.grade,
        answerInfo.gender,
        answerInfo.phoneNum,
        answerInfo.id,
      ]);

      return true;
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

      await conn.query(query, [applicantInfo.clubNum, applicantInfo.id]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ApplicationStorage;
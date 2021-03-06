'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findOneLeader(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT leader 
        FROM clubs 
        WHERE no = ?;`;

      const leader = await conn.query(query, [clubNum]);

      return leader[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneClient(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT id, name, major, grade, gender, phone_number AS phoneNumber 
        FROM students 
        WHERE id = ?;`;

      const clientInfo = await conn.query(query, [id]);

      return clientInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllQuestions(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no, description 
        FROM questions 
        WHERE club_no = ?;`;

      const questions = await conn.query(query, [clubNum]);

      return questions;
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

      const query = `
        INSERT INTO questions (club_no, description) 
        VALUES (?, ?);`;

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

  static async findOneWaitingApplicant(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no 
        FROM applicants 
        WHERE club_no = ? AND reading_flag = 0 
        LIMIT 1;`;

      const applicant = await conn.query(query, [clubNum]);

      return applicant[0];
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

      const query = `
        UPDATE questions 
        SET description = ? 
        WHERE no = ?;`;

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

  static async deleteQuestion(questionNo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE 
        FROM questions 
        WHERE no = ?;`;

      const question = await conn.query(query, [questionNo]);

      return question.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async checkApplicantRecord(applicantInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT reading_flag AS readingFlag 
        FROM applicants 
        WHERE club_no = ? AND student_id = ? 
        ORDER BY no DESC;`;

      const applicant = await conn.query(query, [
        applicantInfo.clubNum,
        applicantInfo.clientId,
      ]);

      return applicant[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findDuplicatePhoneNum(phoneNumInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT phone_number 
        FROM students 
        WHERE id != ? AND phone_number = ?;`;

      const duplicatePhoneNum = await conn.query(query, [
        phoneNumInfo.clientId,
        phoneNumInfo.phoneNum,
      ]);

      return duplicatePhoneNum[0];
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

      const query = `
        UPDATE students 
        SET grade = ?, gender = ?, phone_number = ? 
        WHERE id = ?;`;

      const basicAnswer = await conn.query(query, [
        answerInfo.grade,
        answerInfo.gender,
        answerInfo.phoneNum,
        answerInfo.clientId,
      ]);

      return basicAnswer.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteExtraAnswer(extraAnswerInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE 
        FROM answers 
        WHERE question_no 
        IN (?) AND student_id = ?;`;

      await conn.query(query, [
        extraAnswerInfo.extraQuestionNums,
        extraAnswerInfo.clientId,
      ]);
      return;
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

      let query = `
        INSERT INTO answers (question_no, student_id, description) 
        VALUES`;

      answerInfo.extraAnswers.forEach((extraAnswer, idx) => {
        if (idx) {
          query += `, ("${extraAnswer.no}", "${answerInfo.clientId}", "${extraAnswer.description}")`;
        } else
          query += ` ("${extraAnswer.no}", "${answerInfo.clientId}", "${extraAnswer.description}")`;
      });
      query += ';';

      const extraAnswer = await conn.query(`${query}`);

      return extraAnswer.affectedRows;
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

      const query = `
        INSERT INTO applicants (club_no, student_id) 
        VALUES (?, ?);`;

      const applicant = await conn.query(query, [
        applicantInfo.clubNum,
        applicantInfo.clientId,
      ]);

      return applicant.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ApplicationStorage;

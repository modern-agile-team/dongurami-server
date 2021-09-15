'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();

    try {
      const leader = 'SELECT leader FROM clubs WHERE no = ?;'; // 동아리 회장만 수정 가능 -> 동아리 회장 학번 조회
      const qustion =
        'SELECT no, description FROM questions WHERE club_no = ?;';
      const existClub = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(existClub, clubNum);

      if (club[0] === undefined) {
        // 동아리 존재 x
        return { success: false };
      }

      const questions = await conn.query(qustion, clubNum);
      const clubLeader = await conn.query(leader, clubNum);

      return { success: true, clubLeader, questions };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createQuestion(questionInfo) {
    const conn = await mariadb.getConnection();

    try {
      const query =
        'INSERT INTO questions (club_no, description) VALUE ( ?, ? );';

      await conn.query(query, [questionInfo.clubNum, questionInfo.description]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateQuestion(questionInfo) {
    const conn = await mariadb.getConnection();

    try {
      const query = 'UPDATE questions SET description = ? WHERE no = ?;';

      await conn.query(query, [questionInfo.description, questionInfo.no]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteQuestion(no) {
    const conn = await mariadb.getConnection();

    try {
      const query = 'DELETE FROM questions WHERE no = ?;';

      await conn.query(query, no);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ApplicationStorage;

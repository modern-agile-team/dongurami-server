'use strict';

const mariadb = require('../../../config/mariadb');

class ApplicationStorage {
  static async findAllByClubNum(clubNum) {
    const conn = await mariadb.getConnection();
    try {
      const query = 'SELECT no, description FROM questions WHERE club_no = ?';
      const result = await conn.query(query, clubNum);

      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createQuestion(applicationInfo) {
    const conn = await mariadb.getConnection();
    try {
      let query = 'INSERT INTO questions (club_no, description) VALUES';

      applicationInfo.questions.forEach((x, idx) => {
        if (idx === 0) query += `( ? , "${x}")`;
        else query += `,( "${applicationInfo.clubNum}" , "${x}")`;
      });
      query += ';';

      console.log(query);
      await conn.query(query, applicationInfo.clubNum);

      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ApplicationStorage;

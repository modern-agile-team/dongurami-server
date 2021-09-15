'use strict';

const mariadb = require('../../../config/mariadb');

class applicationStorage2 {
  static async findOneByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = `SELECT s.name, s.id, s.major, s.grade, s.gender, s.phone_number
        FROM applicants 
        JOIN answers ON applicants.reading_flag = 0 AND applicants.student_id = answers.student_id AND applicants.club_no = ?
        JOIN questions ON answers.question_no = questions.no
        JOIN students AS s ON answers.student_id = s.id;`;

      const application = await conn.query(query, clubNum);

      return { success: true, application };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = applicationStorage2;

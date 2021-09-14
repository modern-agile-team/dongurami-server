'use strict';

const mariadb = require('../../../config/mariadb');

class applicationStorage2 {
  static async findOneByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const query = `SELECT students.name, students.id, students.major, students.grade, students.gender, students.phone_number, 
        questions.description AS 'question', answers.description AS 'answer' FROM applicants 
        JOIN answers ON applicants.reading_flag = 0 AND applicants.student_id = answers.student_id AND applicants.club_no = ?
        JOIN questions ON answers.question_no = questions.no
        JOIN students ON answers.student_id = students.id;`;

      const application = await conn.query(query, clubNum);
      console.log(application);
      return { success: true, application };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = applicationStorage2;

'use strict';

const mariadb = require('../../../config/mariadb');

class applicationStorage2 {
  static async findOneByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();

      const applicantInfoQuery = `SELECT s.name, s.id, s.major, s.grade, s.gender, s.phone_number FROM students AS s 
        JOIN applicants AS app ON app.club_no = ?
        AND app.student_id = s.id AND app.reading_flag = 0;`;

      const questionAndAnswerQuery = `SELECT app.student_id, q.description AS question, a.description AS answer FROM answers AS a
        JOIN applicants AS app ON a.student_id = app.student_id 
        AND app.club_no = ? AND app.reading_flag = 0 
        JOIN questions AS q ON a.question_no = q.no;`;

      const applicantInfo = await conn.query(applicantInfoQuery, clubNum);
      const AllquestionAndAnswer = await conn.query(
        questionAndAnswerQuery,
        clubNum
      );
      const questionAndAnswer = {};
      questionAndAnswer.id = AllquestionAndAnswer[0].student_id;

      for (let i = 0; i < AllquestionAndAnswer.length; i += 1) {
        questionAndAnswer[AllquestionAndAnswer[i].question] =
          AllquestionAndAnswer[i].answer;
      }

      return {
        success: true,
        applicantInfo: applicantInfo[0],
        questionAndAnswer,
      };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = applicationStorage2;

'use strict';

const mariadb = require('../../../config/mariadb');

class homeStorage {
  static async findOneByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'select club_name, logo_url, file_id, introduce from clubs where no= ?';
      const query2 =
        'SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no =? AND gender = 1';
      const query3 =
        'SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no =? AND gender = 2';
      // clubInfo 조회
      const result = await conn.query(query, clubNum);
      // 남자인 회원수 clubInfo 추가
      result[0].genderMan = (await conn.query(query2, clubNum)).length;
      // 여자인 회원수 clubInfo 추가
      result[0].genderWomen = (await conn.query(query3, clubNum)).length;
      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async saveClub(clubInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = `UPDATE clubs SET introduce =? WHERE no=?`;
      await conn.query(query, [clubInfo.introduce, clubInfo.clubNum]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = homeStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class homeStorage {
  static async findOneByClubNum(clubNum) {
    const conn = await mariadb.getConnection();
    try {
      const query =
        'select name, logo_url AS logoUrl, file_id AS fileId, introduce from clubs where no= ?';
      const query2 =
        'SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no =? AND gender = 1';
      const query3 =
        'SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no =? AND gender = 2';
      // 존재하는 동아리인지 판별
      const clubs = await conn.query('SELECT no FROM clubs');
      let isClub = false;
      for (let i = 0; i < clubs.length; i += 1) {
        if (clubs[i].no === Number(clubNum)) {
          isClub = true;
          break;
        }
      }
      // 동아리가 존재한다면
      if (isClub) {
        // clubInfo 조회
        const result = await conn.query(query, clubNum);
        // 남자인 회원수 clubInfo 추가
        result[0].genderMan = (await conn.query(query2, clubNum)).length;
        // 여자인 회원수 clubInfo 추가
        result[0].genderWomen = (await conn.query(query3, clubNum)).length;
        return { success: true, result };
      }
      // 동아리 존재 x
      return { success: false, result: '존재하지 않는 동아리입니다.' };
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
      const query = `UPDATE clubs SET introduce =?, logo_url =?, file_id =?  WHERE no=?`;
      // club 소개, 로고 변경 시 업데이트
      await conn.query(query, [
        clubInfo.introduce,
        clubInfo.logoUrl,
        clubInfo.fileId,
        clubInfo.clubNum,
      ]);
      return ture;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = homeStorage;

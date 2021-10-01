'use strict';

const mariadb = require('../../../config/mariadb');

class MyPageStorage {
  static async findAllScraps(userInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = `SELECT s.no, s.description, s.in_date AS inDate s.modify_date AS modifyDate,  
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no 
      WHERE s.student_id = ? AND club_no = ?;`;
      const scraps = await conn.query(query, [
        userInfo.id,
        userInfo.clubNum[0],
      ]);
      console.log(scraps);

      return { success: true, scraps };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  // static async findAllScrapsBySubClub(userInfo) {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();
  //     const query = '';
  //   } catch {
  //     throw err;
  //   }
  // }
}

module.exports = MyPageStorage;

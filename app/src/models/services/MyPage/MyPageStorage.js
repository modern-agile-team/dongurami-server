'use strict';

const mariadb = require('../../../config/mariadb');

class MyPageStorage {
  static async findAllScraps(userInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = `SELECT scraps.no, scraps.board_no AS boardNo, scraps.student_id AS studentId, scraps.description, scraps.in_date AS inDate 
      FROM scraps 
      INNER JOIN boards ON boards.no = board_no 
      WHERE scraps.student_id = ? AND club_no = ?;`;
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

  //   }
  // }
}

module.exports = MyPageStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class MyPageStorage {
  static async existClub(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT no FROM clubs WHERE no = ?;';
      const club = await conn.query(query, clubNum);

      return club[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllScrapsByclubNum(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const query = `SELECT s.no, s.title, s.in_date AS inDate, s.modify_date AS modifyDate, file_url AS fileUrl, file_id AS fileId
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no
      WHERE s.student_id = ? AND club_no = ?;`;

      const query2 =
        'SELECT no, description FROM boards WHERE board_category_no = 7 AND student_id = ?';
      const scraps = await conn.query(query, [userInfo.id, userInfo.clubNum]);
      const boards = await conn.query(query2, [userInfo.id]);

      return { scraps, boards };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneScrap(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      const query = `SELECT s.no, s.title, s.description, b.description AS scrapDescription, LEFT(s.in_date, 7) AS inDate, LEFT(s.modify_date, 7) AS modifyDate
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no
      WHERE s.student_id = ? AND club_no = ? AND s.no = ?;`;
      const scrap = await conn.query(query, [
        userInfo.id,
        userInfo.clubNum,
        userInfo.scrapNo,
      ]);

      return scrap;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = MyPageStorage;

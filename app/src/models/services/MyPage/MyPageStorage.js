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

      const scrap = `SELECT no AS scrapNo, title, in_date AS inDate, modify_date AS modifyDate, file_url AS imgPath
      FROM scraps
      WHERE student_id = ? AND club_no = ?;`;
      const board = `SELECT b.no AS boardNo, title, in_date AS inDate, modify_date AS modifyDate, url AS imgPath
      FROM boards AS b LEFT JOIN images ON b.no = board_no 
      WHERE board_category_no = 7 AND student_id = ? AND club_no = ?
      UNION
      SELECT b.no AS boardNo, title, in_date AS inDate, modify_date AS modifyDate, url AS imgPath
      FROM images RIGTH JOIN boards AS b ON b.no = board_no 
      WHERE board_category_no = 7 AND student_id = ? AND club_no = ?;`;

      const scraps = await conn.query(scrap, [userInfo.id, userInfo.clubNum]);
      const boards = await conn.query(board, [
        userInfo.id,
        userInfo.clubNum,
        userInfo.id,
        userInfo.clubNum,
      ]);

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

      const findScrap = `SELECT no, student_id AS studentId, st.name, title, scrap_description AS scrapDescription, board_description AS boardDescription, LEFT(s.in_date, 10) AS inDate, LEFT(s.modify_date, 10) AS modifyDate
      FROM scraps AS s
      INNER JOIN students AS st ON st.id = student_id
      WHERE student_id = ? AND no = ?;`;

      const scrap = await conn.query(findScrap, [
        userInfo.id,
        userInfo.scrapNum,
      ]);

      return scrap[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createScrapNum(scrapInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO scraps (student_id, club_no, title, scrap_description, board_description, file_url) VALUES (?, ?, ?, ?, ?, ?);`;

      const scrap = await conn.query(query, [
        scrapInfo.id,
        scrapInfo.clubNum,
        scrapInfo.title,
        scrapInfo.scrapDescription,
        scrapInfo.boardDescription,
        scrapInfo.fileUrl,
      ]);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findBoardDescription(scrapNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT board_description AS description FROM scraps WHERE no = ?;`;

      const board = await conn.query(query, scrapNum);

      return board[0].description;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOneByScrapNum(scrapInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE scraps SET title = ?, scrap_description = ? , file_url = ? WHERE no = ?;`;

      const scrap = await conn.query(query, [
        scrapInfo.title,
        scrapInfo.description,
        scrapInfo.fileUrl,
        scrapInfo.scrapNum,
      ]);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneByScrapNum(scrapNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'DELETE FROM scraps WHERE no = ?;';

      const scrap = await conn.query(query, scrapNum);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = MyPageStorage;

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

      const scrap = `SELECT s.no AS scrapNo, s.title, s.in_date AS inDate, s.modify_date AS modifyDate, url AS imgPath
      FROM scraps AS s
      LEFT JOIN images AS i ON i.board_no = s.board_no
      JOIN boards AS b ON b.no = s.board_no
      WHERE s.student_id = ? AND club_no = ?;`;
      const scraps = await conn.query(scrap, [userInfo.id, userInfo.clubNum]);
      const board = `SELECT b.no AS boardNo, title, in_date AS inDate, modify_date AS modifyDate, url AS imgPath
      FROM boards AS b left JOIN images AS i ON b.no = i.board_no 
      WHERE board_category_no = 7 AND student_id = ? AND club_no = ?
      union
      SELECT b.no AS boardNo, title, in_date AS inDate, modify_date AS modifyDate, url AS imgPath
      FROM images right JOIN boards AS b ON b.no = board_no 
      WHERE board_category_no = 7 AND student_id = ? AND club_no = ?;`;
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

      const findScrap = `SELECT s.no, s.title, s.description, b.description AS scrapDescription, LEFT(s.in_date, 7) AS inDate, LEFT(s.modify_date, 7) AS modifyDate
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no
      WHERE s.student_id = ? AND club_no = ? AND s.no = ?;`;
      const scrap = await conn.query(findScrap, [
        userInfo.id,
        userInfo.clubNum,
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

      const infoOfScrap = [
        scrapInfo.boardNum,
        scrapInfo.id,
        scrapInfo.title,
        scrapInfo.description,
      ];
      const query = `INSERT INTO scraps (board_no, student_id, title, description) VALUES (?, ?, ?, ?);`;
      const scrap = await conn.query(query, infoOfScrap);

      return scrap.affectedRows;
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

      const query = `UPDATE scraps SET title = ?, description = ? WHERE no = ?;`;
      const scrap = await conn.query(query, [
        scrapInfo.title,
        scrapInfo.description,
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

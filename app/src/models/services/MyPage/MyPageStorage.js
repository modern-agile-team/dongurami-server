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
      const query = `SELECT s.no, s.title, s.in_date AS inDate, s.modify_date AS modifyDate, file_url AS imgPath, file_id AS imgName
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no
      WHERE s.student_id = ? AND club_no = ?;`;

      const query2 = `SELECT no, title, description, in_date AS inDate, modify_date AS modifyDate 
      FROM boards WHERE board_category_no = 7 AND student_id = ? AND club_no = ?; `;
      const scraps = await conn.query(query, [userInfo.id, userInfo.clubNum]);
      const boards = await conn.query(query2, [userInfo.id, userInfo.clubNum]);
      const query3 = `SELECT board_no AS boardNo, url AS imgPath, file_id AS imgName 
      FROM images 
      INNER JOIN boards ON board_no = boards.no 
      WHERE board_category_no = 7 AND club_no = 1 AND student_id = 'test5';`;
      const boardsImages = await conn.query(query3, [
        userInfo.id,
        userInfo.clubNum,
      ]);

      const thumbnail = [];
      const see = [];
      boardsImages.forEach((x) => {
        if (!see.includes(x.boardNo)) {
          see.push(x.boardNo);
          thumbnail.push(x);
        }
      });

      return { scraps, boards, thumbnail };
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
        userInfo.scrapNum,
      ]);

      const query2 = `SELECT images.url AS imgPath, images.file_id AS imgName 
      FROM images 
      INNER JOIN scraps ON images.board_no = scraps.board_no
      WHERE scraps.no = ?`;
      const images = await conn.query(query2, [userInfo.scrapNum]);

      return { scrap, images };
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

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

  static async createThumbnail(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT description FROM boards WHERE no = ?`;
      const thumbnail = await conn.query(query, boardNum);
      const imgReg = /(<img[^>]*(src\s*=\s*"([']?([^>"'])+)["']?[^>]*)>)/gi;

      imgReg.test(thumbnail[0].description);

      const a = RegExp.$3;

      if (a.match(/^.*\//gi)) {
        const imgPath = a.match(/^.*\//gi)[0];
        const igmName = a.replace(/^.*\//gi, '');
        return { imgPath, igmName };
      }
      return { imgPath: null, imgNamg: null };
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

      const scrap = `SELECT s.no, s.title, s.in_date AS inDate, s.modify_date AS modifyDate, file_url AS imgPath, file_id AS imgName
      FROM scraps AS s
      INNER JOIN boards AS b ON b.no = board_no
      WHERE s.student_id = ? AND club_no = ?;`;
      const board = `SELECT no, title, description, in_date AS inDate, modify_date AS modifyDate 
      FROM boards WHERE board_category_no = 7 AND student_id = ? AND club_no = ?; `;
      const scraps = await conn.query(scrap, [userInfo.id, userInfo.clubNum]);
      const boards = await conn.query(board, [userInfo.id, userInfo.clubNum]);
      const imgReg = /(<img[^>]*(src\s*=\s*"([']?([^>"'])+)["']?[^>]*)>)/gi;

      if (boards[0]) {
        const see = [];
        boards.forEach((x, idx) => {
          if (!see.includes(x.no)) {
            imgReg.test(x.description);
            const a = RegExp.$3;
            if (!a.match(/^.*\//gi)) {
              boards[idx].imgPath = null;
              boards[idx].imgName = null;
            } else {
              boards[idx].imgPath = a.match(/^.*\//gi);
              boards[idx].imgName = a.replace(/^.*\//gi, '');
            }
          }
        });
      }

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

      return scrap;
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

      const { filePath, fileName } = await this.createThumbnail(
        scrapInfo.boardNum
      );

      if (filePath) {
        const query = `INSERT INTO scraps (board_no, student_id, title, description, file_url, file_id) VALUES (?, ?, ?, ?, ?, ?);`;
        const scrap = await conn.query(query, [
          scrapInfo.boardNum,
          scrapInfo.id,
          scrapInfo.title,
          scrapInfo.description,
          filePath,
          fileName,
        ]);
        return scrap.affectedRows;
      }
      const query = `INSERT INTO scraps (board_no, student_id, title, description) VALUES (?, ?, ?, ?);`;
      const scrap = await conn.query(query, [
        scrapInfo.boardNum,
        scrapInfo.id,
        scrapInfo.title,
        scrapInfo.description,
      ]);
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
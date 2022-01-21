'use strict';

const mariadb = require('../../../config/mariadb');

class ImageStorage {
  static async saveBoardImg(imgInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      let query = 'INSERT INTO images (board_no, url) VALUES (?)';

      for (let i = 1; i < imgInfo.length; i += 1) query += ', (?)';
      query += ';';

      const image = await conn.query(query, imgInfo);

      return image.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByBoardImg(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT url AS imgPath FROM images WHERE images.board_no = ?;';

      const imgPath = await conn.query(query, [boardNum]);

      return imgPath;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateBoardImg(newThumbnailInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'UPDATE images SET url = ? WHERE board_no = ?;';

      const result = await conn.query(query, [
        newThumbnailInfo.newThumbnail,
        newThumbnailInfo.boardNum,
      ]);

      return result.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteBoardImg(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM images WHERE url IN (?);`;

      const result = await conn.query(query, [boardInfo]);

      return result.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ImageStorage;

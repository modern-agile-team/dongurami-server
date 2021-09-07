'use strict';

const mariadb = require('../../../config/mariadb');

class ImageStorage {
  static async saveBoardImg(imgInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const imgNums = [];
      let query = 'INSERT INTO images (board_no, url, file_id) VALUES (?)';
      for (let i = 1; i < imgInfo.length; i += 1) query += ', (?)';
      query += ';';

      const img = await conn.query(query, imgInfo);

      for (let i = 0; i < img.affectedRows; i += 1) {
        imgNums.push(img.insertId - i);
      }

      return imgNums;
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
        'SELECT url AS imgPath, file_id AS imgName FROM images WHERE images.board_no = ?;';

      const imgPath = await conn.query(query, [boardNum]);

      return imgPath;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ImageStorage;

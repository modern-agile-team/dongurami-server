'use strict';

const mariadb = require('../../../config/mariadb');

class ImageStorage {
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

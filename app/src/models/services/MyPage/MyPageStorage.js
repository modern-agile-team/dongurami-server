'use strict';

const mariadb = require('../../../config/mariadb');

class MyPageStorage {
  static async findAllScraps(id) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT * FROM scraps WHERE student_id = ?;';
      const scraps = await conn.query(query, id);

      return { success: true, scraps };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = MyPageStorage;

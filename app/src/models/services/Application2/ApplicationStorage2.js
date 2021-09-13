'use strict';

const mariadb = require('../../../config/mariadb');

class applicationStorage2 {
  static async findOneApplicationByClubNum() {
    let conn;
    try {
      conn = await mariadb.getConnection();
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = applicationStorage2;

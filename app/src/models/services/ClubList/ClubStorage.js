'use strict';

const mariadb = require('../../../config/mariadb');

class ClubStorage {
  static async findAll() {
    const conn = await mariadb.getConnection();

    try {
      const query = 'SELECT no, name, category, logo_url, file_id FROM clubs;';
      const result = await conn.query(query);

      return { success: true, result };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ClubStorage;

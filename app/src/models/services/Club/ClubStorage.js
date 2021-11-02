'use strict';

const mariadb = require('../../../config/mariadb');
const Error = require('../../utils/Error');

class ClubStorage {
  static async readClubList() {
    const conn = await mariadb.getConnection();

    try {
      const query =
        'SELECT no, name, category, logo_url AS logoUrl FROM clubs WHERE no > 1;';
      const result = await conn.query(query);

      return { success: true, msg: '동아리 목록 조회 성공', result };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    } finally {
      conn?.release();
    }
  }

  static async clubListSearch(name) {
    const conn = await mariadb.getConnection();

    const keyword = `%${name.replace(/(\s*)/g, '')}%`;

    try {
      const query = `SELECT no, name, category, logo_url AS logoUrl FROM clubs WHERE REPLACE(name, ' ', '') like ?;`;
      const result = await conn.query(query, [keyword]);

      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ClubStorage;

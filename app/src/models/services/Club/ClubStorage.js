'use strict';

const mariadb = require('../../../config/mariadb');
const Error = require('../../utils/Error');

class ClubStorage {
  static async readClubList() {
    let conn;

    try {
      conn = await mariadb.getConnection();

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

  static async findAllClubList(name) {
    let conn;

    const keyword = `%${name.replace(/(\s*)/g, '')}%`;

    try {
      conn = await mariadb.getConnection();

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

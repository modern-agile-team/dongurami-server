'use strict';

const mariadb = require('../../config/mariadb');

class WriterCheck {
  static async ctrl(
    authId,
    no,
    table,
    noColumn = 'no',
    writerIdColumn = 'student_id'
  ) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT ${writerIdColumn} AS id FROM ${table} WHERE ${noColumn} = ${no};`;

      const writerId = await conn.query(query);

      if (authId === writerId[0].id) return { success: true };
      return { success: false, msg: '작성자와 요청자가 다릅니다.' };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = WriterCheck;

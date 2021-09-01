'use strict';

const mariadb = require('../../../config/mariadb');

class StudentStorage {
  static async save(studentInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'INSERT INTO students (id, password, name, email, password_salt, major) VALUES (?, ?, ?, ?, ?, ?);';
      await conn.query(query, [
        studentInfo.client.id,
        studentInfo.hash,
        studentInfo.client.name,
        studentInfo.client.email,
        studentInfo.passwordSalt,
        studentInfo.client.major,
      ]);
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async checkIdAndEmail(id, email) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT id, email FROM students WHERE id = ? OR email = ?;';
      const result = await conn.query(query, [id, email]);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = StudentStorage;

'use strict';

const mariadb = require('../../../config/mariadb');

class StudentStorage {
  static async findOneById(clientInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'SELECT id, password, name, email, admin_flag AS adminFlag, profile_image_url AS profileImageUrl FROM students WHERE id = ?;';
      const result = await conn.query(query, [clientInfo.id]);
      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByNameAndEmail(clientInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT id FROM students WHERE name = ? AND email = ?;';
      await conn.query(query, [clientInfo.name, clientInfo.email]);
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

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

  static async findOneByIdAndEmail(clientInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT id, email FROM students WHERE id = ? OR email = ?;';
      const idEmailList = await conn.query(query, [
        clientInfo.id,
        clientInfo.email,
      ]);
      return idEmailList[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = StudentStorage;

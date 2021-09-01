'use strict';

const mariadb = require('../../../config/mariadb');

class StudentStorage {
  // static async getStudentInfo() {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();
  //     const query = 'SELECT * FROM students;';
  //     const result = await conn.query(query, []);
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     conn?.release();
  //   }
  // }

  // static async findOneById(id) {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();
  //     const query = 'SELECT * FROM students WHERE id = ?;';
  //     const result = await conn.query(query, [id]);
  //     return result[0];
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     conn?.release();
  //   }
  // }

  // static async findOneByName(name) {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();
  //     const query = 'SELECT * FROM students WHERE name = ?;';
  //     const result = await conn.query(query, [name]);
  //     return result[0];
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     conn?.release();
  //   }
  // }

  // static async findOneByEmail(email) {
  //   let conn;
  //   try {
  //     conn = await mariadb.getConnection();
  //     const query = 'SELECT * FROM students WHERE email = ?;';
  //     const result = await conn.query(query, [email]);
  //     return result[0];
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     conn?.release();
  //   }
  // }

  static async save(studentInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'INSERT INTO students (id, password, name, email, password_salt, admin_flag, major) VALUES (?, ?, ?, ?, ?, ?, ?);';
      await conn.query(query, [
        studentInfo.id,
        studentInfo.password,
        studentInfo.name,
        studentInfo.email,
        studentInfo.password_salt,
        studentInfo.admin_flag,
        studentInfo.major,
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

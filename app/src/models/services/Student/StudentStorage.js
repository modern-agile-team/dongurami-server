'use strict';

const mariadb = require('../../../config/mariadb');

class StudentStorage {
  static async findOneById(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT id, password, name, email, admin_flag AS adminFlag, profile_image_url AS profileImageUrl FROM students WHERE id = ?;';

      const result = await conn.query(query, id);

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

      const result = await conn.query(query, [
        clientInfo.name,
        clientInfo.email,
      ]);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async save(saveInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'INSERT INTO students (id, password, name, email, password_salt, major) VALUES (?, ?, ?, ?, ?, ?);';

      await conn.query(query, [
        saveInfo.id,
        saveInfo.hash,
        saveInfo.name,
        saveInfo.email,
        saveInfo.passwordSalt,
        saveInfo.major,
      ]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByIdOrEmail(clientInfo) {
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

  static async findOneByLoginedId(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT club_no AS clubNum FROM members WHERE student_id = ?;';

      const clubList = await conn.query(query, [studentId]);

      const clubs = [];

      for (let i = 0; i < clubList.length; i += 1) {
        clubs.push(clubList[i].clubNum);
      }
      return clubs;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByEmail(email) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = 'SELECT * FROM students WHERE email = ?;';

      const result = await conn.query(query, email);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByPhoneNum(phoneNum, id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id FROM students WHERE phone_number = ? AND id != ?;`;

      const result = await conn.query(query, [phoneNum, id]);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async modifyPasswordSave(saveInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE students SET password = ?, password_salt = ? WHERE id = ?;';

      await conn.query(query, [
        saveInfo.hash,
        saveInfo.passwordSalt,
        saveInfo.id,
      ]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async snsSave(saveInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const save = `INSERT INTO students (id, password, name, email, password_salt, major) VALUES (?, ?, ?, ?, ?, ?);`;
      const sns = `INSERT INTO sns_info (student_id, sns_id) VALUES (?, ?);`;

      const saveResult = await conn.query(save, [
        saveInfo.id,
        saveInfo.hash,
        saveInfo.name,
        saveInfo.email,
        saveInfo.passwordSalt,
        saveInfo.major,
      ]);
      const snsResult = await conn.query(sns, [saveInfo.id, saveInfo.snsId]);

      if (snsResult.affectedRows && saveResult.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneBySnsId(snsId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT student_id AS studentId, sns_id AS snsId FROM sns_info WHERE sns_id = ?;`;

      const result = await conn.query(query, [snsId]);

      if (result[0]) return { success: true, result: result[0] };
      return { success: false };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneSnsUserById(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id, email FROM students WHERE id = ?;`;

      const result = await conn.query(query, [id]);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllNameAndId() {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id, name FROM students;`;

      const result = await conn.query(query);

      return result;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = StudentStorage;

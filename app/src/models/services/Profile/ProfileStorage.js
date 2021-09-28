'use strict';

const mariadb = require('../../../config/mariadb');

class ProfileStorage {
  static async findInfoByStudentId(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id, name, email, major, profile_image_url AS profileImageUrl
      FROM students
      WHERE id = ?;`;

      const studentInfo = await conn.query(query, [id]);

      return studentInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllClubByStudentId(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT name FROM clubs
      LEFT JOIN members
      ON clubs.no = members.club_no
      WHERE members.student_id = ?;`;

      const clubList = await conn.query(query, [id]);

      return clubList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ProfileStorage;

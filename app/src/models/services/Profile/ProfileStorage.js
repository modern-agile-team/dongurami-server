'use strict';

const mariadb = require('../../../config/mariadb');

class ProfileStorage {
  static async findInfoByStudentId(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT id, name, email, phone_number AS phoneNumber, grade, gender, major, profile_image_url AS profileImageUrl, file_id AS fileId
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

      const query = `SELECT clubs.no, clubs.name FROM clubs
      LEFT JOIN members
      ON clubs.no = members.club_no
      WHERE members.student_id = ?
      ORDER BY clubs.no ASC;`;

      const clubList = await conn.query(query, [id]);

      return clubList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateStudentInfo(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE students SET email = ?, phone_number = ?, grade = ?, profile_image_url = ?, file_id = ? WHERE id = ?;`;

      const student = await conn.query(query, [
        userInfo.email,
        userInfo.phoneNumber,
        userInfo.grade,
        userInfo.profileImageUrl,
        userInfo.fileId,
        userInfo.userId,
      ]);

      return student.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ProfileStorage;

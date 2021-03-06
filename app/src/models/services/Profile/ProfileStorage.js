'use strict';

const mariadb = require('../../../config/mariadb');

class ProfileStorage {
  static async findInfoByStudentId(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT id, name, email, phone_number AS phoneNumber, grade, gender, major, profile_image_url AS profileImageUrl, admin_flag AS adminFlag
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

  static async findOneSnsUserById(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT sns.student_id AS studentId, st.email
        FROM sns_info AS sns
        LEFT JOIN students AS st
        ON sns.student_id = st.id
        WHERE student_id = ?;`;

      const snsUserInfo = await conn.query(query, [id]);

      return snsUserInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneOtherEmail(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT id
        FROM students
        WHERE email = ? AND id != ?;`;

      const studentId = await conn.query(query, [userInfo.email, userInfo.id]);

      return studentId[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneOtherPhoneNum(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT id
        FROM students
        WHERE phone_number = ? AND id != ?;`;

      const studentId = await conn.query(query, [
        userInfo.phoneNumber,
        userInfo.id,
      ]);

      return studentId[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllClubById(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT clubs.no, clubs.name
        FROM clubs
        LEFT JOIN members
        ON clubs.no = members.club_no
        WHERE members.student_id = ?
        ORDER BY clubs.no ASC;`;

      const clubs = await conn.query(query, [id]);

      return clubs;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllClubNumByid(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT club_no AS clubNum
        FROM members
        WHERE student_id = ?;`;

      const clubs = await conn.query(query, [studentId]);

      return clubs;
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

      const query = `
        UPDATE students
        SET email = ?, phone_number = ?, grade = ?, profile_image_url = ?
        WHERE id = ?;`;

      const student = await conn.query(query, [
        userInfo.email,
        userInfo.phoneNumber,
        userInfo.grade,
        userInfo.profileImageUrl,
        userInfo.id,
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

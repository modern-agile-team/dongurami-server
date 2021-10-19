'use strict';

const mariadb = require('../../../config/mariadb');

class ReviewStorage {
  static async saveReview(reviewInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'INSERT INTO reviews (club_no, student_id, description, score) VALUES (?, ?, ?, ?);';

      await conn.query(query, [
        reviewInfo.clubNum,
        reviewInfo.id,
        reviewInfo.description,
        reviewInfo.score,
      ]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT * FROM reviews WHERE student_id = ? AND club_no = ?;';

      const review = await conn.query(query, [
        userInfo.studentId,
        userInfo.clubNum,
      ]);

      if (!review[0]) return false;
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT no, student_id AS studentId, description, score, in_date AS inDate FROM reviews WHERE club_no = ?;';

      const reviews = await conn.query(query, [clubNum]);

      return { success: true, reviews };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateById(reviewInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'UPDATE reviews SET description = ?, score = ? WHERE no = ?;';
      const updateReview = await conn.query(query, [
        reviewInfo.description,
        reviewInfo.score,
        reviewInfo.num,
      ]);
      if (updateReview.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteByNum(reviewNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'DELETE FROM reviews WHERE no = ?;';
      const deleteReview = await conn.query(query, [reviewNum]);

      if (deleteReview.affectedRows) return true;
      return false;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ReviewStorage;

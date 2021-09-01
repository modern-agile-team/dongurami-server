'use strict';

const mariadb = require('../../../config/mariadb');

class reviewStorage {
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
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }

  static async findAllByReview(userInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT club_no FROM reviews WHERE student_id = ?';
      const review = await conn.query(query, [userInfo.studentId]);
      let isReview = true;

      for (let i = 0; i < review.length; i += 1) {
        if (review[i].club_no === userInfo.clubNum) {
          isReview = false;
          break;
        }
      }
      return isReview;
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }

  static async findOneByReview(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'SELECT student_id, description, score, in_date FROM reviews WHERE club_no = ?';
      const reviewList = await conn.query(query, [clubNum]);

      return { success: true, reviewList };
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }
}

module.exports = reviewStorage;

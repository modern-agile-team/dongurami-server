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

  static async findAllReview() {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'SELECT student_id, description, score, in_date FROM reviews';
      const reviewList = await conn.query(query, []);
      console.log(reviewList);
      return reviewList;
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }
}

module.exports = reviewStorage;

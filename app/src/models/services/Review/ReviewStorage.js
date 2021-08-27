'use strict';

const mariadb = require('../../../config/mariadb');

class reviewStorage {
  static async saveReview(reviewInfo) {
    console.log(reviewInfo);
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
}

module.exports = reviewStorage;

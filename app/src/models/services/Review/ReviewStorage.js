'use strict';

const mariadb = require('../../../config/mariadb');

class reviewStorage {
  static async saveReview(reviewInfo, payload) {
    console.log(reviewInfo, payload);
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'INSERT INTO reviews(student_id, club_no, description,  score) VALUES (?, ?, ?, ?);';
      await conn.query(query, [
        payload.id,
        payload.clubNum,
        reviewInfo.description,
        reviewInfo.score,
      ]);
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }
}

module.export = {
  reviewStorage,
};

'use strict';

const mariadb = require('../../../config/mariadb');

class ReviewStorage {
  static async findOneById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT * 
        FROM reviews 
        WHERE student_id = ? AND club_no = ?;`;

      const review = await conn.query(query, [
        userInfo.studentId,
        userInfo.clubNum,
      ]);

      return review[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findReviewByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no, student_id AS studentId, description, score, in_date AS inDate 
        FROM reviews 
        WHERE club_no = ? 
        ORDER BY in_date DESC;`;

      const reviewList = await conn.query(query, [clubNum]);

      return reviewList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async saveReview(reviewInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO reviews (club_no, student_id, description, score) 
        VALUES (?, ?, ?, ?);`;

      const review = await conn.query(query, [
        reviewInfo.clubNum,
        reviewInfo.id,
        reviewInfo.description,
        reviewInfo.score,
      ]);

      return review.insertId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOneById(reviewInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE reviews 
        SET description = ?, score = ? 
        WHERE no = ?;`;

      const updateReview = await conn.query(query, [
        reviewInfo.description,
        reviewInfo.score,
        reviewInfo.num,
      ]);

      return updateReview.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneByNum(reviewNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM reviews 
        WHERE no = ?;`;

      const deleteReview = await conn.query(query, [reviewNum]);

      return deleteReview.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = ReviewStorage;

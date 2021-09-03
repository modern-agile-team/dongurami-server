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
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllById(userInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'SELECT club_no AS clubNum FROM reviews WHERE student_id = ?;';
      const review = await conn.query(query, [userInfo.studentId]);
      let isReview = true;

      for (let i = 0; i < review.length; i += 1) {
        if (review[i].clubNum === userInfo.clubNum) {
          isReview = false;
          break;
        }
      }
      return isReview;
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
      const reviewList = await conn.query(query, [clubNum]);

      return { success: true, reviewList };
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
      await conn.query(query, [
        reviewInfo.description,
        reviewInfo.score,
        reviewInfo.num,
      ]);

      return true;
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
      await conn.query(query, [reviewNum]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = reviewStorage;

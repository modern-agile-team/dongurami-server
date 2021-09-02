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

  static async findAllById(userInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query = 'SELECT club_no FROM reviews WHERE student_id = ?;';
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

  static async findOneByClubNum(clubNum) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'SELECT no, student_id, description, score, in_date FROM reviews WHERE club_no = ?;';
      const reviewList = await conn.query(query, [clubNum]);

      return { success: true, reviewList };
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }

  static async updateById(reviewInfo) {
    let conn;
    try {
      conn = await mariadb.getConnection();
      const query =
        'UPDATE reviews SET description = ? score = ? WHERE club_no = ? AND student_id = ?;';
      await conn.query(query, [
        reviewInfo.description,
        reviewInfo.score,
        reviewInfo.clubNum,
        reviewInfo.id,
      ]);

      return true;
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
    } finally {
      conn?.release();
    }
  }
}

module.exports = reviewStorage;

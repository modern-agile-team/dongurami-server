'use strict';

const mariadb = require('../../../config/mariadb');

class reviewStorage {
  static getClubNum(id) {
    let conn;
    try {
      conn = mariadb.getConnection();
      const query = 'SELECT club_no FROM members WHERE student_id = ?;';
      const review = conn.query(query, [id]);
      return review[0].club_no;
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

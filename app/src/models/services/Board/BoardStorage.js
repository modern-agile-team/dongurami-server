'use strict';

const mariadb = require('../../../config/mariadb');

class BoardStorage {
  static async findAllByCategoryNum(boardCategory) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT bo.no, bo.title, st.id, st.name, clubs.club_name, clubs.category, bo.in_date, img.url, img.file_id, bo.hit
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE bo.board_category_no = ?;`;

      const boardList = await conn.query(query, [boardCategory]);

      return boardList;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByBoardNum(category, boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT bo.no, st.id, st.name, bo.title, bo.description, clubs.club_name, clubs.category, bo.in_date, img.url, img.file_id, bo.hit
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE bo.board_category_no = ? AND bo.no = ?;`;

      const board = await conn.query(query, [category, boardNum]);

      return board;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = BoardStorage;

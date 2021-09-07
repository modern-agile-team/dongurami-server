'use strict';

const mariadb = require('../../../config/mariadb');

class BoardStorage {
  static async createBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO boards (student_id, club_no, board_category_no, title, description) VALUES (?, ?, ?, ?, ?);`;

      const board = await conn.query(query, [
        boardInfo.id,
        boardInfo.clubNo,
        boardInfo.category,
        boardInfo.title,
        boardInfo.description,
      ]);

      return board.insertId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByCategoryNum(boardCategory) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, bo.modify_date AS modifyDate, img.url, img.file_id AS fileId, bo.hit
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE bo.board_category_no = ?
      GROUP BY no;`;

      const boardList = await conn.query(query, [boardCategory]);

      return boardList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByBoardNum(category, boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT bo.no, bo.student_id AS studentId, st.name, bo.title, bo.description, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, bo.modify_date AS modifyDate, bo.hit
      FROM boards AS bo
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE bo.board_category_no = ? AND bo.no = ?;`;

      const board = await conn.query(query, [category, boardNum]);

      return board;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyHitByNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'UPDATE boards SET hit = hit + 1, modify_date = modify_date WHERE no = ?;';

      await conn.query(query, [boardNum]);

      return;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = BoardStorage;

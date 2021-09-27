'use strict';

const mariadb = require('../../../config/mariadb');

class BoardStorage {
  static async createBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `INSERT INTO boards (board_category_no, student_id, club_no, title, description) VALUES (?, ?, ?, ?, ?);`;

      const board = await conn.query(query, [
        boardInfo.category,
        boardInfo.id,
        boardInfo.clubNum,
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

  static async findAllByCategoryNum(criteriaRead) {
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
      WHERE bo.board_category_no = ? AND bo.club_no = ?
      GROUP BY no
      ORDER BY ${criteriaRead.sort} ${criteriaRead.order};`;

      const boardList = await conn.query(query, [
        criteriaRead.category,
        criteriaRead.clubNum,
      ]);

      return boardList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByPromotionCategory(criteriaRead) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      let whole = '';

      if (criteriaRead.clubCategory !== 'whole') {
        whole = ` AND clubs.category = '${criteriaRead.clubCategory}'`;
      }

      const query = `SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, bo.modify_date AS modifyDate, img.url, img.file_id AS fileId, bo.hit
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE bo.board_category_no = 4${whole}
      GROUP BY no
      ORDER BY ${criteriaRead.sort} ${criteriaRead.order};`;

      const boardList = conn.query(query);

      return boardList;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneByBoardNum(boardInfo) {
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

      const board = await conn.query(query, [
        boardInfo.category,
        boardInfo.boardNum,
      ]);

      return board[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOneByBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE boards SET title = ?, description = ? WHERE no = ?;`;

      const board = await conn.query(query, [
        boardInfo.title,
        boardInfo.description,
        boardInfo.boardNum,
      ]);

      return board.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `DELETE FROM boards WHERE no = ?;`;

      const board = await conn.query(query, [boardNum]);

      return board.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async existOnlyBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT no FROM boards WHERE no = ?;`;

      const board = await conn.query(query, [boardNum]);

      return board[0];
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

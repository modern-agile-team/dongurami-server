'use strict';

const mariadb = require('../../../config/mariadb');

const BoardUtil = require('./Utils');

class BoardStorage {
  static async createBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO boards (board_category_no, student_id, club_no, title, description, writer_hidden_flag)
        VALUES (?, ?, ?, ?, ?, ?);`;

      const board = await conn.query(query, [
        boardInfo.category,
        boardInfo.id,
        boardInfo.clubNum,
        boardInfo.title,
        boardInfo.description,
        boardInfo.hiddenFlag,
      ]);

      return board.insertId;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findBoardAdminFlag(clubNum, id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT board_admin_flag AS boardAdminFlag
        FROM members 
        WHERE club_no = ? AND student_id = ?;`;

      const boardAdminFlag = await conn.query(query, [clubNum, id]);

      return boardAdminFlag[0].boardAdminFlag;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findClubByClubNum(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no
        FROM clubs
        WHERE no = ?;`;

      const club = await conn.query(query, [clubNum]);

      return club[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByCategoryNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, img.url, bo.hit, writer_hidden_flag AS writerHiddenFlag,
        (SELECT COUNT(no) FROM comments
        WHERE board_no = bo.no) AS commentCount,
        (SELECT COUNT(no) FROM board_emotions
        WHERE board_no = bo.no) AS emotionCount
        FROM boards AS bo
        LEFT JOIN images AS img
        ON bo.no = img.board_no
        JOIN students AS st
        ON bo.student_id = st.id
        JOIN clubs
        ON bo.club_no = clubs.no
        WHERE bo.board_category_no = ? AND bo.club_no = ?
        GROUP BY no
        ORDER BY ${boardInfo.sort} ${boardInfo.order};`;

      const boards = await conn.query(query, [
        boardInfo.category,
        boardInfo.clubNum,
      ]);

      return boards;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByPromotionCategory(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const { category, direction } =
        BoardUtil.getAddQueryForPromotion(boardInfo);

      console.log(category, direction);

      const query = `
        SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, clubs.no AS clubNo, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, img.url, bo.hit, writer_hidden_flag AS writerHiddenFlag,
        (SELECT COUNT(no) FROM comments
        WHERE board_no = bo.no) AS commentCount,
        (SELECT COUNT(no) FROM board_emotions
        WHERE board_no = bo.no) AS emotionCount
        FROM boards AS bo
        LEFT JOIN images AS img
        ON bo.no = img.board_no
        JOIN students AS st
        ON bo.student_id = st.id
        JOIN clubs
        ON bo.club_no = clubs.no
        WHERE bo.board_category_no = 4${category}${direction}
        GROUP BY no
        ORDER BY ${boardInfo.sort} ${boardInfo.order}
        LiMIT 8;`;

      console.log(query);

      const boards = await conn.query(query);

      return boards;
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

      const query = `
        SELECT bo.no, bo.student_id AS studentId, st.name, bo.title, bo.description, clubs.no AS clubNo, clubs.name AS clubName, clubs.category, bo.in_date AS inDate, bo.hit, st.profile_image_url AS profileImageUrl, writer_hidden_flag AS writerHiddenFlag,
        (SELECT COUNT(no) FROM board_emotions
        WHERE board_no = bo.no) AS emotionCount,
        (SELECT COUNT(no) FROM board_emotions
        WHERE board_no = bo.no AND student_id = ?) AS likedFlag
        FROM boards AS bo
        JOIN students AS st
        ON bo.student_id = st.id
        JOIN clubs
        ON bo.club_no = clubs.no
        WHERE bo.board_category_no = ? AND bo.no = ?;`;

      const board = await conn.query(query, [
        boardInfo.studentId,
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

  static async findAllByBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT cmt.student_id AS studentId, st.name AS studentName, cmt.no, cmt.description, cmt.depth, cmt.group_no AS groupNo, cmt.reply_flag AS replyFlag, cmt.in_date AS inDate, st.profile_image_url AS profileImageUrl, writer_hidden_flag AS writerHiddenFlag,
        (SELECT COUNT(no)
        FROM comment_emotions
        WHERE comment_no = cmt.no) +
        (SELECT COUNT(no)
        FROM reply_comment_emotions
        WHERE reply_comment_no = cmt.no) AS emotionCount,
        (SELECT COUNT(no)
        FROM comment_emotions
        WHERE comment_no = cmt.no AND student_id = ? AND depth = 0) +
        (SELECT COUNT(no)
        FROM reply_comment_emotions
        WHERE reply_comment_no = cmt.no AND student_id = ? AND depth = 1) AS likedFlag
        FROM comments AS cmt
        JOIN students AS st
        ON cmt.student_id = st.id
        WHERE cmt.board_no = ?
        ORDER BY cmt.group_no, inDate;`;

      const comments = await conn.query(query, [
        boardInfo.studentId,
        boardInfo.studentId,
        boardInfo.boardNum,
      ]);

      return comments;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllByBoardImg(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query =
        'SELECT url AS imgPath FROM images WHERE images.board_no = ?;';

      const imgPath = await conn.query(query, [boardNum]);

      return imgPath;
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

      const query = `
        UPDATE boards
        SET title = ?, description = ?, writer_hidden_flag = ?
        WHERE no = ? AND board_category_no = ?;`;

      const board = await conn.query(query, [
        boardInfo.title,
        boardInfo.description,
        boardInfo.hiddenFlag,
        boardInfo.boardNum,
        boardInfo.category,
      ]);

      return board.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOnlyHitByNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE boards
        SET hit = hit + 1
        WHERE board_category_no = ? AND no = ?;`;

      const board = await conn.query(query, [
        boardInfo.category,
        boardInfo.boardNum,
      ]);

      return board.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneByBoardNum(boardInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM boards
        WHERE no = ? AND board_category_no = ?;`;

      const board = await conn.query(query, [
        boardInfo.boardNum,
        boardInfo.category,
      ]);

      return board.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  // 여기부터 창훈이형 코드여서 일단 둠

  static async findAllSearch(searchInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const keyword = `%${searchInfo.keyword.replace(/(\s*)/g, '')}%`;
      const hiddenFlag =
        searchInfo.type === 'st.name' ? `AND writer_hidden_flag = 0` : ``;

      const query = `
      SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, bo.club_no AS clubNo, clubs.name AS clubName, bo.board_category_no AS boardCategoryNo, bo.in_date AS inDate, img.url, bo.hit, bo.writer_hidden_flag AS writerHiddenFlag,
      (SELECT COUNT(no) FROM comments
      WHERE board_no = bo.no) AS commentCount,
      (SELECT COUNT(no) FROM board_emotions
      WHERE board_no = bo.no) AS emotionCount
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE REPLACE(${searchInfo.type}, ' ', '') LIKE ? AND board_category_no = ? AND club_no = ? ${hiddenFlag}
      ORDER BY ${searchInfo.sort} ${searchInfo.order};`;

      const boards = await conn.query(query, [
        keyword,
        searchInfo.category,
        searchInfo.clubno,
      ]);

      return boards;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllPromotionSearch(searchInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const keyword = `%${searchInfo.keyword.replace(/(\s*)/g, '')}%`;
      let where = '';
      let limit = '';

      if (searchInfo.lastNum >= 0) {
        limit = `LIMIT 8`;
        if (searchInfo.lastNum > 0) {
          where = ` AND bo.no < ${searchInfo.lastNum}`;
        }
        if (searchInfo.order === 'asc') {
          where = ` AND bo.no > ${searchInfo.lastNum}`;
        }
      }

      const query = `
      SELECT bo.no, bo.title, bo.student_id AS studentId, st.name AS studentName, bo.club_no AS clubNo, clubs.name AS clubName, clubs.category AS category, bo.board_category_no AS boardCategoryNo, bo.in_date AS inDate, img.url, bo.hit
      FROM boards AS bo
      LEFT JOIN images AS img
      ON bo.no = img.board_no
      JOIN students AS st
      ON bo.student_id = st.id
      JOIN clubs
      ON bo.club_no = clubs.no
      WHERE REPLACE(${searchInfo.type}, ' ', '') LIKE ? AND board_category_no = 4${where}
      GROUP BY no
      ORDER BY ${searchInfo.sort} ${searchInfo.order}
      ${limit};`;

      const boards = await conn.query(query, [keyword]);

      return boards;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findBoardInfoByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT s.name, s.id, b.title FROM boards AS b 
        JOIN students AS s ON b.student_id = s.id 
        WHERE b.no = ?;`;

      const board = await conn.query(query, [boardNum]);

      const recipientInfo = {
        id: board[0].id,
        name: board[0].name,
        title: board[0].title,
      };

      return recipientInfo;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = BoardStorage;

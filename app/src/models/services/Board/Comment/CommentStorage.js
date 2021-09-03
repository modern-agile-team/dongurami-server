'use strict';

const mariadb = require('../../../../config/mariadb');

class CommentStorage {
  static async findAllByBoardNum(boardNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `SELECT cmt.student_id AS studentId, st.name AS studentName, cmt.no, cmt.description, cmt.depth, cmt.group_no AS groupNo, cmt.reply_flag AS replyFlag, cmt.in_date AS inDate, cmt.modify_date AS modifyDate, st.profile_image_url AS profileImageUrl, st.file_id As profileImageName
      FROM comments AS cmt
      JOIN students AS st
      ON cmt.student_id = st.id
      WHERE cmt.board_no = ?;`;

      const comments = await conn.query(query, [boardNum]);

      return comments;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = CommentStorage;

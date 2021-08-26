'use strict';

const mariadb = require('../../config/mariadb');

const process = {
  readPromotionList: async (req, res) => {
    const query = `SELECT bo.no, st.name, img.url, img.file_id, tag.tagname
    FROM boards AS bo
    JOIN images AS img
    ON bo.no = img.no
    JOIN hashtags AS tag
    ON bo.no = tag.board_no
    JOIN students AS st
    ON bo.student_id = st.id
    WHERE bo.board_category_no = 1;`;
    let conn;

    try {
      conn = await mariadb.getConnection();

      const promotionList = await conn.query(query);

      return res.status(200).json(promotionList);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (conn) conn?.release();
    }
  },
};

module.exports = process;

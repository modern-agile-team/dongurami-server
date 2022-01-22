'use strict';

const mariadb = require('../../../config/mariadb');

class MyPageStorage {
  static async existClub(clubNum) {
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

  static async findAllScraps(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT no AS scrapNo, title, in_date AS inDate, file_url AS imgPath
        FROM scraps
        WHERE student_id = ? AND club_no = ? 
        ORDER BY in_date DESC;`;

      const scraps = await conn.query(query, [userInfo.id, userInfo.clubNum]);

      return scraps;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllMyPagePosts(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT b.no AS boardNo, title, in_date AS inDate, url AS imgPath
        FROM boards AS b 
        LEFT JOIN images 
        ON b.no = board_no 
        WHERE board_category_no = 7 AND student_id = ? AND club_no = ?
        UNION
        SELECT b.no AS boardNo, title, in_date AS inDate, url AS imgPath
        FROM images 
        RIGTH JOIN boards AS b 
        ON b.no = board_no 
        WHERE board_category_no = 7 AND student_id = ? AND club_no = ?;`;

      const myPagePosts = await conn.query(query, [
        userInfo.id,
        userInfo.clubNum,
        userInfo.id,
        userInfo.clubNum,
      ]);

      return myPagePosts;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllBoards(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const board = `
        SELECT no, club_no AS clubNo, board_category_no AS boardCategoryNum, title, LEFT(in_date, 10) AS inDate
        FROM boards 
        WHERE student_id = ? AND board_category_no < 7 
        ORDER BY in_date DESC;`;

      const boards = await conn.query(board, [id]);

      return boards;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findAllComments(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const comment = `
        SELECT b.no, b.club_no AS clubNo, b.board_category_no AS boardCategoryNum, b.title, c.description, LEFT(c.in_date, 10) AS inDate 
        FROM comments AS c
        JOIN boards AS b 
        ON c.board_no = b.no
        WHERE c.student_id = ? 
        ORDER BY c.in_date DESC;`;

      const comments = await conn.query(comment, [id]);

      return comments;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneScrap(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const findScrap = `
        SELECT no, student_id AS studentId, st.name, st.profile_image_url AS profileImageUrl, title, scrap_description AS scrapDescription, board_description AS boardDescription, LEFT(s.in_date, 10) AS inDate
        FROM scraps AS s
        INNER JOIN students AS st 
        ON st.id = student_id
        WHERE student_id = ? AND no = ?;`;

      const scrap = await conn.query(findScrap, [
        userInfo.id,
        userInfo.scrapNum,
      ]);

      return scrap[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async createScrapNum(scrapInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        INSERT INTO scraps (student_id, club_no, title, scrap_description, board_description, file_url) 
        VALUES (?, ?, ?, ?, ?, ?);`;

      const scrap = await conn.query(query, [
        scrapInfo.id,
        scrapInfo.clubNum,
        scrapInfo.title,
        scrapInfo.scrapDescription,
        scrapInfo.boardDescription,
        scrapInfo.fileUrl,
      ]);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findBoardDescription(scrapNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT board_description AS description 
        FROM scraps 
        WHERE no = ?;`;

      const board = await conn.query(query, [scrapNum]);

      return board[0].description;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateOneByScrapNum(scrapInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE scraps 
        SET title = ?, scrap_description = ? , file_url = ? WHERE no = ?;`;

      const scrap = await conn.query(query, [
        scrapInfo.title,
        scrapInfo.description,
        scrapInfo.fileUrl,
        scrapInfo.scrapNum,
      ]);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteOneByScrapNum(scrapNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
      DELETE FROM scraps 
      WHERE no = ?;`;

      const scrap = await conn.query(query, [scrapNum]);

      return scrap.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findClubLeader(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT leader 
        FROM clubs 
        WHERE leader = ? AND no = ?;`;

      const result = await conn.query(query, [
        userInfo.memberId,
        userInfo.clubNum,
      ]);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateRejectedApplicant(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE applicants
        UPDATE applicants 
        SET reading_flag = 2 
        WHERE club_no = ? AND student_id = ?;`;

      const isUpdate = await conn.query(query, [userInfo.clubNum, userInfo.id]);

      return isUpdate.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async deleteMemberById(userInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        DELETE FROM members 
        WHERE club_no = ? AND student_id = ?;`;

      const isDelete = await conn.query(query, [userInfo.clubNum, userInfo.id]);

      return isDelete.affectedRows;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findUserInfoById(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT id, name, admin_flag AS adminFlag, profile_image_url AS profileImageUrl 
        FROM students
        WHERE id = ?;`;

      const result = await conn.query(query, [id]);

      return result[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findJoinedClubsById(studentId) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT club_no AS clubNum
        FROM members
        WHERE student_id = ?;`;

      const clubList = await conn.query(query, [studentId]);

      const clubs = [];

      for (let i = 0; i < clubList.length; i += 1) {
        clubs.push(clubList[i].clubNum);
      }
      return clubs;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = MyPageStorage;

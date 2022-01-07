'use strict';

const mariadb = require('../../../config/mariadb');

class HomeStorage {
  static async findOneLeader(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT s.id, s.name, s.profile_image_url AS profileImageUrl 
        FROM students AS s
        LEFT JOIN clubs AS c 
        ON c.leader = s.id 
        WHERE c.no = ?;`;

      const leader = await conn.query(query, [clubNum]);

      return leader[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneClient(ids) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const findFlag = `
        SELECT join_admin_flag AS joinAdminFlag, board_admin_flag AS boardAdminFlag 
        FROM members 
        WHERE student_id = ?;`;

      const flags = await conn.query(findFlag, ids.clientId);
      const clientInfo = {};

      clientInfo.leaderFlag = ids.leaderId === ids.clientId;

      clientInfo.flag = flags[0] || {};

      return clientInfo;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async findOneClubInfo(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const findClubInfo = `
        SELECT name, category, logo_url AS logoUrl, introduce 
        FROM clubs 
        WHERE no = ?;`;

      const clubInfo = await conn.query(findClubInfo, clubNum);

      return clubInfo[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async checkClubGender(clubNum) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT SUM(M) AS man, SUM(W) AS women 
        FROM (SELECT (CASE gender WHEN 1 THEN 1 ELSE 0 END) AS M, 
        (CASE gender WHEN 2 THEN 1 ELSE 0 END) AS W 
        FROM (SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no = ?) 
        AS collectMember) AS collectGender;`;

      const cntGender = await conn.query(query, clubNum);

      return cntGender[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async isLeader(id) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        SELECT leader 
        FROM clubs 
        WHERE no = ?;`;

      const leader = await conn.query(query, id);

      return leader[0];
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateClubIntroduce(clubInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE clubs 
        SET introduce = ? 
        WHERE no = ?;`;

      await conn.query(query, [clubInfo.introduce, clubInfo.clubNum]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateClubLogo(logoInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `
        UPDATE clubs 
        SET logo_url = ? 
        WHERE no = ?;`;

      await conn.query(query, [logoInfo.logoUrl, logoInfo.clubNum]);

      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = HomeStorage;

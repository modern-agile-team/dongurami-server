'use strict';

const mariadb = require('../../../config/mariadb');

class HomeStorage {
  static async findOneByClubNum(clubInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();
      // 동아리 정보 조회
      const findClubInfo =
        'SELECT name, category, logo_url AS logoUrl, file_id AS fileId, introduce FROM clubs WHERE no = ?;';
      // 동아리 성별 수 조회
      const gender = `SELECT SUM(M) AS man, SUM(W) AS women FROM 
        (SELECT (CASE gender WHEN 1 THEN 1 ELSE 0 END) AS M, 
        (CASE gender WHEN 2 THEN 1 ELSE 0 END) AS W 
        FROM (SELECT gender FROM students INNER JOIN members ON students.id = members.student_id WHERE club_no = ?) 
        AS collectMember) AS collectGender;`;
      // 동아리 존재 여부
      const existLeader = 'SELECT leader FROM clubs WHERE no = ?;';
      const leader = await conn.query(existLeader, clubInfo.clubNum);

      if (leader[0] === undefined) {
        // 동아리 존재 x
        return { success: false, result: '존재하지 않는 동아리입니다.' };
      }

      // 동아리가 존재한다면
      // clubInfo 조회
      const result = await conn.query(findClubInfo, clubInfo.clubNum);
      const cntGender = await conn.query(gender, clubInfo.clubNum);

      result[0].genderMan = cntGender[0].man;
      result[0].genderWomen = cntGender[0].women;

      // 사용자가 리더인지, 동아리원이라면 권한 정보 포함
      const findFlag =
        'SELECT join_admin_flag AS joinAdminFlag, board_admin_flag AS boardAdminFlag FROM members WHERE student_id = ?;';
      const flags = await conn.query(findFlag, clubInfo.id);
      const clientInfo = {};

      clientInfo.leader = leader[0].leader === clubInfo.id ? 1 : 0;
      clientInfo.flag = flags;

      return { success: true, clientInfo, result };
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }

  static async updateClubInfo(clubInfo) {
    let conn;

    try {
      conn = await mariadb.getConnection();

      const query = `UPDATE clubs SET introduce = ? WHERE no = ?;`;

      // club 소개 변경 시 업데이트
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

      const query = `UPDATE clubs SET logo_url = ?, file_id = ?  WHERE no = ?;`;

      // 로고 변경 시 업데이트
      await conn.query(query, [
        logoInfo.logoUrl,
        logoInfo.fileId,
        logoInfo.clubNum,
      ]);
      return true;
    } catch (err) {
      throw err;
    } finally {
      conn?.release();
    }
  }
}

module.exports = HomeStorage;

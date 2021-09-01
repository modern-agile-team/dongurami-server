'use strict';

const mariadb = require('../../../config/mariadb');

class homeStorage {
  static async findOneByClubNum(clubNum) {
    try {
      const query =
        'select club_name, logo_url, file_id, introduce from clubs where no= ?';
      return await mariadb.query(query, clubNum);
    } catch (err) {
      return false;
    }
  }

  static async saveClub(clubInfo) {
    try {
      const conn = await mariadb.getConnection();
      const query = `UPDATE clubs SET introduce =? WHERE no=?`;
      await conn.query(query, [clubInfo.introduce, this.params.clubNum]);
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = homeStorage;

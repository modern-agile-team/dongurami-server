'use strict';

const AdminOptionStorage = require('./AdminOptionStorage');
const Error = require('../../utils/Error');

class AdminOption {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async checkClubAdmin() {
    const payload = this.auth;

    try {
      const { response } = await AdminOptionStorage.findFunctionById(
        payload.id
      );

      if (response === undefined) {
        return {
          success: false,
          msg: '동아리 관리 페이지에 접근 권한이 없습니다.',
        };
      }

      return {
        success: true,
        msg: '권한 있음',
      };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }

  async findOneByClubNum() {
    const clubNum = Number(this.params.clubNum);

    try {
      const { findNameSuccess, leader, memberAndAuthList } =
        await AdminOptionStorage.findOneByClubNum(clubNum);

      if (findNameSuccess) {
        return { success: true, leader, memberAndAuthList };
      }

      return { success: false, msg: '서버에러' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = AdminOption;

'use strict';

const ProfileStorage = require('./ProfileStorage');
const Error = require('../../utils/Error');

class Profile {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByStudentId() {
    try {
      const id = this.params.studentId;

      const profile = await ProfileStorage.findInfoByStudentId(id);

      if (profile === undefined) {
        return { success: false, msg: '존재하지 않는 회원입니다.' };
      }

      const clubs = await ProfileStorage.findAllClubByStudentId(id);

      profile.clubs = [];
      for (let i = 0; i < clubs.length; i += 1) {
        profile.clubs.push(clubs[i].name);
      }

      let userInfo = '비로그인 회원입니다.';

      if (this.auth) {
        userInfo = {
          id: this.auth.id,
          club: this.auth.clubNum,
        };
      }

      return { success: true, msg: '프로필 조회 성공', userInfo, profile };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }
}

module.exports = Profile;

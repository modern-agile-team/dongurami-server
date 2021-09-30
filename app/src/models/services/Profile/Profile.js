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
          isAdmin: this.auth.isAdmin,
        };
      }

      return { success: true, msg: '프로필 조회 성공', userInfo, profile };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async updateStudentInfo() {
    const request = this.body;
    const userInfo = {
      email: request.email,
      phoneNumber: request.phoneNumber,
      grade: request.grade,
      profileImageUrl: request.profileImageUrl,
      fileId: request.fileId,
      userId: this.auth.id,
    };
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    let msg = '';

    if (this.params.studentId !== userInfo.userId) {
      msg = '로그인된 사람의 프로필이 아닙니다.';
    } else if (userInfo.email.match(regExp) === null) {
      msg = '이메일 형식이 맞지 않습니다.';
    } else if (userInfo.phoneNumber.length !== 11) {
      msg = '전화번호 형식이 맞지 않습니다.';
    }
    if (msg) return { success: false, msg };

    try {
      const studentUpdateCnt = await ProfileStorage.updateStudentInfo(userInfo);

      if (studentUpdateCnt === 0) {
        return { success: false, msg: '존재하지 않는 회원입니다.' };
      }
      return { success: true, msg: '회원정보 수정 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Profile;

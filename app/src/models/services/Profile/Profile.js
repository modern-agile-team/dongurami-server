'use strict';

const ProfileStorage = require('./ProfileStorage');
const Error = require('../../utils/Error');
const StudentStorage = require('../Student/StudentStorage');
const Auth = require('../Auth/Auth');

class Profile {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByStudentId() {
    try {
      const id = this.params.studentId;
      const user = this.auth;

      const profile = await ProfileStorage.findInfoByStudentId(id);

      if (profile === undefined) {
        return { success: false, msg: '존재하지 않는 회원입니다.' };
      }
      if (!user || profile.id !== user.id) {
        delete profile.email;
        delete profile.phoneNumber;
        delete profile.grade;
        delete profile.gender;
      }

      const clubs = await ProfileStorage.findAllClubByStudentId(id);

      profile.clubs = [];

      for (const club of clubs) {
        profile.clubs.push({
          no: club.no,
          name: club.name,
        });
      }

      let userInfo = '비로그인 회원입니다.';

      if (user) {
        userInfo = {
          id: user.id,
          isAdmin: user.isAdmin,
        };
      }

      return { success: true, msg: '프로필 조회 성공', userInfo, profile };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요', err);
    }
  }

  async updateStudentInfo() {
    const request = this.body;
    const user = this.auth;
    const userInfo = {
      email: request.email,
      phoneNumber: request.phoneNumber,
      grade: request.grade,
      profileImageUrl: request.profileImageUrl,
      userId: user.id,
    };
    const emailRegExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const phoneNumberRegExp = /[eE]/;
    let msg = '';

    if (this.params.studentId !== userInfo.userId) {
      msg = '로그인된 사람의 프로필이 아닙니다.';
    } else if (userInfo.email && userInfo.email.match(emailRegExp) === null) {
      msg = '이메일 형식이 맞지 않습니다.';
    } else if (
      userInfo.phoneNumber &&
      (userInfo.phoneNumber.length !== 11 ||
        Number.isNaN(Number(userInfo.phoneNumber)) ||
        !(userInfo.phoneNumber.match(phoneNumberRegExp) === null))
    ) {
      msg = '전화번호 형식이 맞지 않습니다.';
    }
    if (msg) return { success: false, msg };

    try {
      const studentUpdateCnt = await ProfileStorage.updateStudentInfo(userInfo);

      if (studentUpdateCnt === 0) {
        return { success: false, msg: '존재하지 않는 회원입니다.' };
      }
      if (userInfo.profileImageUrl !== user.profilePath) {
        const checkedId = await StudentStorage.findOneById(user.id);
        const clubs = await StudentStorage.findOneByLoginedId(user.id);
        const jwt = await Auth.createJWT(checkedId, clubs);

        return { success: true, msg: '회원정보 수정 성공', jwt };
      }
      return { success: true, msg: '회원정보 수정 성공' };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Profile;

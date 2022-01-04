'use strict';

const StudentStorage = require('../Student/StudentStorage');
const ProfileStorage = require('./ProfileStorage');
const ProfileUtil = require('./utils');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');

class Profile {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
    this.auth = req.auth;
  }

  async findOneByStudentId() {
    const { studentId } = this.params;
    const user = this.auth;

    try {
      const profile = await ProfileStorage.findInfoByStudentId(studentId);

      if (profile === undefined) {
        return {
          success: false,
          msg: '존재하지 않는 회원입니다.',
          status: 404,
        };
      }
      if (!user || profile.id !== user.id) {
        ProfileUtil.deleteSomeProfileInfo(profile);
      }

      const clubs = await ProfileStorage.findAllClubByStudentId(studentId);

      profile.clubs = ProfileUtil.formattingClubs(clubs);
      profile.naverUserFlag = await ProfileUtil.getNaverUserFlag(user);

      return {
        success: true,
        msg: '프로필 조회 성공',
        status: 200,
        profile,
      };
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
    const EMAIL_REG_EXP =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const PHONE_NUMBER_REG_EXP = /[^0-9]/g;

    if (!EMAIL_REG_EXP.test(userInfo.email)) {
      return {
        success: false,
        msg: '이메일 형식이 맞지 않습니다.',
        status: 400,
      };
    }
    if (
      userInfo.phoneNumber.length !== 11 ||
      PHONE_NUMBER_REG_EXP.test(userInfo.phoneNumber)
    ) {
      return {
        success: false,
        msg: '전화번호 형식이 맞지 않습니다.',
        status: 400,
      };
    }

    try {
      const snsUserInfo = await StudentStorage.findOneSnsUserById(user.id);

      if (
        snsUserInfo &&
        snsUserInfo.studentId === user.id &&
        snsUserInfo.email !== userInfo.email
      ) {
        return {
          success: false,
          msg: '네이버 이메일로 가입된 회원은 이메일 변경이 불가능합니다.',
          status: 403,
        };
      }
      if (this.params.studentId !== userInfo.userId) {
        return {
          success: false,
          msg: '로그인된 사람의 프로필이 아닙니다.',
          status: 403,
        };
      }

      const isEmail = await StudentStorage.findOneByEmail(userInfo.email);

      if (isEmail && isEmail.id !== user.id) {
        return {
          success: false,
          msg: '다른 유저가 사용중인 이메일입니다.',
          status: 409,
        };
      }

      const isPhoneNum = await StudentStorage.findOneByPhoneNum(
        userInfo.phoneNumber,
        user.id
      );

      if (isPhoneNum) {
        return {
          success: false,
          msg: '다른 유저가 사용중인 번호입니다.',
          status: 409,
        };
      }

      const studentUpdateCnt = await ProfileStorage.updateStudentInfo(userInfo);

      if (studentUpdateCnt === 0) {
        return {
          success: false,
          msg: '존재하지 않는 회원입니다.',
          status: 404,
        };
      }
      if (userInfo.profileImageUrl !== user.profilePath) {
        const checkedId = await StudentStorage.findOneById(user.id);
        const clubs = await StudentStorage.findOneByLoginedId(user.id);
        const jwt = await Auth.createJWT(checkedId, clubs);

        return { success: true, msg: '회원정보 수정 성공', status: 200, jwt };
      }
      return { success: true, msg: '회원정보 수정 성공', status: 200 };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Profile;

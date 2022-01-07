'use strict';

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

      const clubs = await ProfileStorage.findAllClubByStudentId(studentId);

      profile.clubs = ProfileUtil.formattingClubs(clubs);
      profile.naverUserFlag = await ProfileUtil.getNaverUserFlag(
        user,
        studentId
      );

      if (!user || profile.id !== user.id) {
        ProfileUtil.deleteSomeProfileInfo(profile);
      }

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
    const userInfo = {
      email: request.email,
      phoneNumber: request.phoneNumber,
      grade: request.grade,
      profileImageUrl: request.profileImageUrl,
      id: this.auth.id,
    };

    if (this.params.studentId !== userInfo.id) {
      return {
        success: false,
        msg: '로그인된 사람의 프로필이 아닙니다.',
        status: 403,
      };
    }
    if (ProfileUtil.emailFormatCheck(userInfo.email)) {
      return {
        success: false,
        msg: '이메일 형식이 맞지 않습니다.',
        status: 400,
      };
    }
    if (ProfileUtil.phoneNumberFormatCheck(userInfo.phoneNumber)) {
      return {
        success: false,
        msg: '전화번호 형식이 맞지 않습니다.',
        status: 400,
      };
    }

    try {
      const snsUserInfo = await ProfileStorage.findOneSnsUserById(userInfo.id);

      if (snsUserInfo && snsUserInfo.email !== userInfo.email) {
        return {
          success: false,
          msg: '네이버 이메일로 가입된 회원은 이메일 변경이 불가능합니다.',
          status: 403,
        };
      }

      const isEmail = await ProfileStorage.findOneOtherEmail(userInfo);

      if (isEmail) {
        return {
          success: false,
          msg: '다른 유저가 사용중인 이메일입니다.',
          status: 409,
        };
      }

      const isPhoneNum = await ProfileStorage.findOneOtherPhoneNum(userInfo);

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

      if (userInfo.profileImageUrl !== this.auth.profilePath) {
        const checkedId = await ProfileStorage.findInfoByStudentId(userInfo.id);
        const clubs = await ProfileStorage.findAllClubNumByid(userInfo.id);
        const jwt = await Auth.createJWT(
          checkedId,
          ProfileUtil.formattingClubsNum(clubs)
        );

        return { success: true, msg: '회원정보 수정 성공', status: 200, jwt };
      }
      return { success: true, msg: '회원정보 수정 성공', status: 200 };
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Profile;

'use strict';

const ProfileStorage = require('./ProfileStorage');
const ProfileUtil = require('./utils');
const Error = require('../../utils/Error');
const Auth = require('../Auth/Auth');

const { makeResponse } = ProfileUtil;

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
        return makeResponse(404, '존재하지 않는 회원입니다.');
      }

      profile.clubs = await ProfileStorage.findAllClubById(studentId);

      profile.naverUserFlag = await ProfileUtil.getNaverUserFlag(
        user,
        studentId
      );

      if (!user || profile.id !== user.id) {
        ProfileUtil.deleteSomeProfileInfo(profile);
      }

      return makeResponse(200, '프로필 조회 성공.', { profile });
    } catch (err) {
      return Error.ctrl('', err);
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
      return makeResponse(403, '로그인된 사람의 프로필이 아닙니다.');
    }
    if (ProfileUtil.emailFormatCheck(userInfo.email)) {
      return makeResponse(400, '이메일 형식이 맞지 않습니다.');
    }
    if (ProfileUtil.phoneNumberFormatCheck(userInfo.phoneNumber)) {
      return makeResponse(400, '전화번호 형식이 맞지 않습니다.');
    }

    try {
      const snsUserInfo = await ProfileStorage.findOneSnsUserById(userInfo.id);

      if (snsUserInfo && snsUserInfo.email !== userInfo.email) {
        return makeResponse(403, '네이버 회원은 이메일 변경이 불가능합니다.');
      }

      const otherEmail = await ProfileStorage.findOneOtherEmail(userInfo);

      if (otherEmail) {
        return makeResponse(409, '다른 유저가 사용중인 이메일입니다.');
      }

      const otherPhoneNumber = await ProfileStorage.findOneOtherPhoneNum(
        userInfo
      );

      if (otherPhoneNumber) {
        return makeResponse(409, '다른 유저가 사용중인 번호입니다.');
      }

      const studentUpdateCnt = await ProfileStorage.updateStudentInfo(userInfo);

      if (studentUpdateCnt === 0) {
        return makeResponse(404, '존재하지 않는 회원입니다.');
      }

      if (userInfo.profileImageUrl !== this.auth.profilePath) {
        const checkedId = await ProfileStorage.findInfoByStudentId(userInfo.id);
        const clubs = await ProfileStorage.findAllClubNumByid(userInfo.id);
        const jwt = await Auth.createJWT(
          checkedId,
          ProfileUtil.formattingClubsNum(clubs)
        );

        return makeResponse(200, '회원정보 수정 성공', { jwt });
      }
      return makeResponse(200, '회원정보 수정 성공');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = Profile;

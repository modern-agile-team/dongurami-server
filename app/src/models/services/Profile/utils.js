'use strict';

const StudentStorage = require('../Student/StudentStorage');

class ProfileUtil {
  static makeResponse(status, msg, moreInfo) {
    const response = {
      success: status < 400,
      msg,
      status,
    };

    for (const info in moreInfo) {
      if (Object.prototype.hasOwnProperty.call(moreInfo, info)) {
        response[info] = moreInfo[info];
      }
    }

    return response;
  }

  static deleteSomeProfileInfo(profile) {
    delete profile.email;
    delete profile.phoneNumber;
    delete profile.grade;
    delete profile.gender;
    delete profile.adminFlag;
  }

  static async getNaverUserFlag(user, studentId) {
    if (user) {
      const studentInfo = await StudentStorage.findOneSnsUserById(studentId);

      if (studentInfo && studentInfo.studentId === studentId) return true;
      return false;
    }
    return false;
  }

  static formattingClubs(clubs) {
    return clubs.map((club) => {
      return { no: club.no, name: club.name };
    });
  }

  static formattingClubsNum(clubs) {
    return clubs.map((club) => {
      return club.clubNum;
    });
  }

  static emailFormatCheck(email) {
    const EMAIL_REG_EXP =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return !EMAIL_REG_EXP.test(email);
  }

  static phoneNumberFormatCheck(phoneNumber) {
    const PHONE_NUMBER_REG_EXP = /[^0-9]/;

    return phoneNumber.length !== 11 || PHONE_NUMBER_REG_EXP.test(phoneNumber);
  }
}

module.exports = ProfileUtil;

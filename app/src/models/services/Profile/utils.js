'use strict';

const StudentStorage = require('../Student/StudentStorage');

class ProfileUtil {
  static deleteSomeProfileInfo(profile) {
    delete profile.email;
    delete profile.phoneNumber;
    delete profile.grade;
    delete profile.gender;
  }

  static async getNaverUserFlag(user) {
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
}

module.exports = ProfileUtil;
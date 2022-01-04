'use strict';

const StudentStorage = require('../Student/StudentStorage');

class ProfileUtil {
  static deleteSomeProfileInfo(profile) {
    delete profile.email;
    delete profile.phoneNumber;
    delete profile.grade;
    delete profile.gender;
  }

  static async updateNaverUserFlag(user, profile) {
    if (user) {
      const studentInfo = await StudentStorage.findOneSnsUserById(studentId);

      if (studentInfo && studentInfo.studentId === studentId) {
        profile.isNaverUser = 1;
      } else profile.isNaverUser = 0;
    } else profile.isNaverUser = 0;
  }

  static formattingClubs(clubs) {
    return clubs.map((club) => {
      return { no: club.no, name: club.name };
    });
  }
}

module.exports = ProfileUtil;

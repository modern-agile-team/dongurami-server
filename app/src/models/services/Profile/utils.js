'use strict';

class ProfileUtil {
  static deleteSomeProfileInfo(profile) {
    delete profile.email;
    delete profile.phoneNumber;
    delete profile.grade;
    delete profile.gender;
  }
}

module.exports = ProfileUtil;

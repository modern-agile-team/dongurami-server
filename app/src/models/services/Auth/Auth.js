'use strict';

// const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;
class Auth {
  static async createJWT(student, clubNum) {
    const payload = {
      id: student.id,
      name: student.name,
      email: student.email,
      profilePath: student.profile_path,
      isAdmin: student.admin_flag,
      clubNum,
    };

    return jwt.sign(payload, SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '1d',
      issuer: 'wooahan agile',
    });
  }

  static async verifyJWT(token) {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  }
}

module.exports.verifyToken = (token) => {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
};

module.exports = Auth;

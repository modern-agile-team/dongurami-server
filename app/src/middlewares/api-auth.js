'use strict';

const bcrypt = require('bcrypt');

const Error = require('../models/utils/Error');

const apiAuth = async (req, res, next) => {
  try {
    const token = req.headers['api-key'] || '';

    const apiKey = bcrypt.hashSync(
      process.env.API_SECRET,
      process.env.API_SALT
    );

    if (token === apiKey) return next();
    return res.status(401).json({
      success: false,
      msg: '허가받지 못한 사이트는 해당 API를 사용할 수 없습니다.',
    });
  } catch (err) {
    return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
  }
};

module.exports = { apiAuth };

'use strict';

const logger = require('../config/logger');
const OAuth = require('../models/services/OAuth/OAuth');

const snsTokenCheck = async (req, res, next) => {
  const oAuth = new OAuth(req);

  try {
    const oAuthUserInfo = await oAuth.findOneByInformation();

    req.body = oAuthUserInfo;
    return next();
  } catch (err) {
    logger.error(`GET /api/naver-login 401: ${err.message}`);
    return res.status(401).json(err);
  }
};

module.exports = { snsTokenCheck };

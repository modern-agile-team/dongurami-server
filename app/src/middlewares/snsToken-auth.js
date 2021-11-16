'use strict';

const logger = require('../config/logger');
const Oauth = require('../models/services/Oauth/Oauth');

const snsTokenCheck = async (req, res, next) => {
  const oauth = new Oauth(req);

  try {
    const oauthUserInfo = await oauth.findOneByInformation();

    req.body = oauthUserInfo;
    return next();
  } catch (err) {
    logger.error(`GET /api/naver-login 401: ${err.message}`);
    return res.status(401).json(err);
  }
};

module.exports = { snsTokenCheck };

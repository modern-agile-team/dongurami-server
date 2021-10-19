'use strict';

const logger = require('../config/logger');

const signUpCheck = async (req, res, next) => {
  const client = req.body;
  const arrClient = Object.entries(client);
  const arr = [];
  const idRegExp = /^\d{9}$/;
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const passwordRegExp = /^[0-9a-zA-Z$@$!%*#?&]{8,}$/;
  const nameRegExp = /^[가-힣-a-zA-Z]+$/;

  for (let i = 0; i < arrClient.length; i += 1) {
    arr.push(arrClient[i][1]);
  }

  if (!arr[0].match(idRegExp)) {
    logger.error(`POST /api/sign-up 400: 아이디 형식이 맞지 않습니다.`);
    return res
      .status(400)
      .json({ success: false, msg: '아이디 형식이 맞지 않습니다.' });
  }
  if (!arr[1].match(passwordRegExp)) {
    logger.error(`POST /api/sign-up 400: 비밀번호 형식이 맞지 않습니다.`);
    return res
      .status(400)
      .json({ success: false, msg: '비밀번호 형식이 맞지 않습니다.' });
  }
  if (!arr[2].match(nameRegExp)) {
    logger.error(`POST /api/sign-up 400: 이름 형식이 맞지 않습니다.`);
    return res
      .status(400)
      .json({ success: false, msg: '이름 형식이 맞지 않습니다.' });
  }
  if (!arr[3].match(emailRegExp)) {
    logger.error(`POST /api/sign-up 400: 이메일 형식이 맞지 않습니다.`);
    return res
      .status(400)
      .json({ success: false, msg: '이메일 형식이 맞지 않습니다.' });
  }
  if (!arr[4]) {
    logger.error(`POST /api/sign-up 400: 학과가 선택되지 않았습니다.`);
    return res
      .status(400)
      .json({ success: false, msg: '학과가 선택되지 않았습니다.' });
  }

  return next();
};

module.exports = { signUpCheck };

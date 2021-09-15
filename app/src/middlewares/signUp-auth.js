'use strict';

const signUpCheck = async (req, res, next) => {
  const client = req.body;

  const arrClient = Object.entries(client);
  const arr = [];

  for (let i = 0; i < arrClient.length; i += 1) {
    arr.push(arrClient[i][1]);
  }

  if (arr[0].length !== 9) {
    return res
      .status(400)
      .json({ success: false, msg: '아이디가 9자리수가 아닙니다.' });
  }

  if (arr[0].indexOf(' ') !== -1) {
    return res
      .status(400)
      .json({ success: false, msg: '아이디에 공백이 포함되어있습니다.' });
  }

  if (arr[1].length < 8) {
    return res
      .status(400)
      .json({ success: false, msg: '비밀번호가 8자리수 미만입니다.' });
  }

  if (arr[2].indexOf(' ') !== -1) {
    return res
      .status(400)
      .json({ success: false, msg: '이름에 공백이 포함되어있습니다.' });
  }

  if (arr[3].indexOf(' ') !== -1) {
    return res
      .status(400)
      .json({ success: false, msg: '이메일에 공백이 포함되어있습니다.' });
  }

  if (arr[4].length === 0) {
    return res
      .status(400)
      .json({ success: false, msg: '학과가 선택되지 않았습니다.' });
  }

  return next();
};

module.exports = { signUpCheck };

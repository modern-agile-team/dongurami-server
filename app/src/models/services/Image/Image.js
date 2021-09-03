'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');

class Image {
  constructor(req) {
    this.params = req.params;
  }

  async findAllByBoardImg() {
    const boardNum = this.params.num;

    try {
      const image = ImageStorage.findAllByBoardImg(boardNum);

      return image;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Image;

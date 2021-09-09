'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');

class Image {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async saveBoardImg(boardNum) {
    const { images } = this.body;
    const imgInfo = [];

    try {
      for (const image of images) {
        imgInfo.push([boardNum, image.path, image.name]);
      }

      const imgNum = await ImageStorage.saveBoardImg(imgInfo);

      return imgNum;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByBoardImg() {
    const boardNum = this.params.num;

    try {
      const imgInfo = await ImageStorage.findAllByBoardImg(boardNum);

      return imgInfo;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Image;

'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');

class Image {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async saveBoardImg(boardNum) {
    const { description } = this.body;
    const imgReg = /(<img[^>]*(src\s*=\s*"([']?([^>"'])+)["']?[^>]*)>)/gi;
    const images = description.match(imgReg);
    const imgInfo = [];

    if (images === null || images.length === 0) return images;

    try {
      images.forEach((url) => {
        const imgPath = url.match(/^.*\//gi)[0];
        const imgName = url.replace(/^.*\//gi, '');

        imgInfo.push([boardNum, imgPath, imgName]);
      });

      const imgNum = await ImageStorage.saveBoardImg(imgInfo);

      return imgNum;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }

  async findAllByBoardImg() {
    const { boardNum } = this.params;

    try {
      const imgInfo = await ImageStorage.findAllByBoardImg(boardNum);

      return imgInfo;
    } catch (err) {
      return Error.ctrl('서버 에러입니다. 서버 개발자에게 얘기해주세요.', err);
    }
  }
}

module.exports = Image;

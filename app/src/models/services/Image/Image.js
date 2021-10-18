'use strict';

const ImageStorage = require('./ImageStorage');
const Error = require('../../utils/Error');
const boardCategory = require('../Category/board');

class Image {
  constructor(req) {
    this.body = req.body;
    this.params = req.params;
  }

  async saveBoardImg(boardNum) {
    const { images } = this.body;
    const imgInfo = [];
    const category = boardCategory[this.params.category];

    if (category === 4 && (images === undefined || images.length === 0)) {
      return [];
    }

    try {
      if (category === 6) {
        const { description } = this.body;
        const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/gi;

        imgReg.test(description);

        const thumbnail = RegExp.$2;

        imgInfo.push([boardNum, thumbnail]);
      } else {
        for (const image of images) {
          imgInfo.push([boardNum, image.path]);
        }
      }

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

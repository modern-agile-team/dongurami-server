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
    const category = boardCategory[this.params.category];
    const imgInfo = [];

    if (category < 4) return { success: true };

    try {
      if (category === 4) {
        const { images } = this.body;

        if (!images.length) return { success: true };

        for (const image of images) {
          imgInfo.push([boardNum, image.path]);
        }
      }
      if (category === 6 || category === 7) {
        const { description } = this.body;
        const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/gi;

        imgReg.test(description);

        const thumbnail = RegExp.$2;

        if (thumbnail.length) imgInfo.push([boardNum, thumbnail]);
      }

      if (imgInfo) {
        await ImageStorage.saveBoardImg(imgInfo);
      }
      return { success: true };
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

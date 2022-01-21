'use strict';

class ImageUtil {
  static getimageInfo(images, boardNum) {
    return images.map((image) => [boardNum, image]);
  }
}

module.exports = ImageUtil;

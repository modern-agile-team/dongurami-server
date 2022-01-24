'use strict';

class ImageUtil {
  static getimageInfo(images, boardNum) {
    return images.map((image) => [boardNum, image]);
  }

  static getNotIncludeImages(targetImages, elementImages) {
    return elementImages.filter((image) => {
      return !targetImages.includes(image);
    });
  }
}

module.exports = ImageUtil;

'use strict';

class MyPageUtil {
  static extractThumbnail(description) {
    const IMG_REG = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/i;

    IMG_REG.test(description);

    return RegExp.$2;
  }
}

module.exports = MyPageUtil;

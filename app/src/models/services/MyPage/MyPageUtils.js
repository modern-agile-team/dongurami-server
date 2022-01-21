'use strict';

class MyPageUtil {
  static makeResponse(status, msg, result) {
    return {
      status,
      success: status < 400,
      msg,
      result,
    };
  }

  static extractThumbnail(description) {
    const IMG_REG = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/i;

    IMG_REG.test(description);

    return RegExp.$2;
  }
}

module.exports = MyPageUtil;

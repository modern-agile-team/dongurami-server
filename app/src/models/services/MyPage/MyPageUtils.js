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
    const IMG_REG = /<img src="([^"]*?)">/i;

    return description.match(IMG_REG)[0].replace(IMG_REG, '$1');
  }
}

module.exports = MyPageUtil;

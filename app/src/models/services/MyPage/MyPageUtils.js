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
    const IMG_REG = /<img src='([^"]*?)'/i;
    const image = description.match(IMG_REG);

    return image ? image[0].replace(IMG_REG, '$1') : null;
  }
}

module.exports = MyPageUtil;

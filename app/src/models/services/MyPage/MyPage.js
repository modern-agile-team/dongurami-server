'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Error = require('../../utils/Error');

class MyPage {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
  }

  async findAllScraps() {
    const { id } = this.params;

    try {
      const { success, scraps } = await MyPageStorage.findAllScraps(id);

      if (success) return { success: true, scraps };
      return { success: false };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = MyPage;

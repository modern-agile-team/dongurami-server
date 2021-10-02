'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Error = require('../../utils/Error');

class MyPage {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
  }

  async findAllScrapsByClubNum() {
    const { params } = this;

    try {
      const userInfo = {
        id: params.id,
        clubNum: params.clubNum,
      };

      const isClub = await MyPageStorage.existClub(params.clubNum);

      if (!isClub) {
        return { success: false, msg: '존재하지 않는 동아리입니다.' };
      }

      const scrpas = await MyPageStorage.findAllScrapsByclubNum(userInfo);

      if (scrpas) return { success: true, scrpas };
      return { success: true, msg: '스크랩 내역이 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }

  async findOneScrap() {
    const { params } = this;

    try {
      const userInfo = {
        id: params.id,
        clubNum: params.clubNum,
        scrapNo: params.scrapNo,
      };

      const { scrap, board } = await MyPageStorage.findOneScrap(userInfo);

      if (scrap[0]) return { success: true, scrap, board };
      return { success: false, msg: '존재하지 않는 글입니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요', err);
    }
  }
}

module.exports = MyPage;

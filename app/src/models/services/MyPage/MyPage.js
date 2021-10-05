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

      const { scraps, boards } = await MyPageStorage.findAllScrapsByclubNum(
        userInfo
      );

      if (scraps || boards) {
        return { success: true, scraps, boards };
      }
      return { success: true, msg: '스크랩 내역이 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findOneScrap() {
    const { params } = this;

    try {
      const userInfo = {
        id: params.id,
        clubNum: params.clubNum,
        scrapNum: params.scrapNum,
      };

      const scrap = await MyPageStorage.findOneScrap(userInfo);

      if (scrap) return { success: true, scrap };
      return { success: false, msg: '존재하지 않는 글입니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createScrapNum() {
    try {
      const scrapInfo = {
        id: this.auth.id,
        boardNum: this.params.boardNum,
        title: this.body.title,
        description: this.body.description,
      };

      const scrap = await MyPageStorage.createScrapNum(scrapInfo);

      if (scrap) return { success: true, msg: '스크랩글이 생성되었습니다.' };
      return { suuccess: false, msg: '글이 스크랩되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateOneByScrapNum() {
    const data = this.body;

    try {
      const scrapInfo = {
        scrapNum: this.params.scrapNum,
        title: data.title,
        description: data.description,
      };

      const scrap = await MyPageStorage.updateOneByScrapNum(scrapInfo);

      if (scrap) return { success: true, msg: '글이 수정되었습니다.' };
      return { success: false, msg: '글이 수정되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async deleteOneByScrapNum() {
    const { scrapNum } = this.params;

    try {
      const scrap = await MyPageStorage.deleteOneByScrapNum(scrapNum);

      if (scrap) return { success: true, msg: '글이 삭제되었습니다.' };
      return { success: false, msg: '글이 삭제되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = MyPage;

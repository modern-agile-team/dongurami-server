'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Error = require('../../utils/Error');
const WriterCheck = require('../../utils/WriterCheck');

class MyPage {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
  }

  async findAllScrapsByClubNum() {
    const { params } = this;

    try {
      if (params.id !== this.auth.id) {
        return { succeess: false, msg: '본인만 열람 가능합니다.' };
      }

      const userInfo = {
        id: params.id,
        clubNum: params.clubNum,
      };

      const isClub = await MyPageStorage.existClub(userInfo.clubNum);

      if (!isClub) {
        return { success: false, msg: '존재하지 않는 동아리입니다.' };
      }

      const { scraps, boards } = await MyPageStorage.findAllScrapsByclubNum(
        userInfo
      );

      if (scraps || boards) {
        return { success: true, msg: '전체 글 조회 성공', scraps, boards };
      }
      return { success: true, msg: '글 내역이 존재하지 않습니다.' };
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

      if (scrap) return { success: true, msg: '스크랩 상세 조회 성공', scrap };
      return { success: false, msg: '존재하지 않는 글입니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async createScrapNum() {
    const data = this.body;

    try {
      if (!data.title) {
        return { success: false, msg: '제목이 존재하지 않습니다.' };
      }

      const descriptions = data.scrapDescription + data.boardDescription;
      const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/i;

      imgReg.test(descriptions);

      const fileUrl = RegExp.$2;

      const scrapInfo = {
        fileUrl,
        id: this.auth.id,
        clubNum: this.params.clubNum,
        title: data.title,
        scrapDescription: data.scrapDescription,
        boardDescription: data.boardDescription,
      };

      const scrap = await MyPageStorage.createScrapNum(scrapInfo);

      if (scrap) return { success: true, msg: '스크랩글이 생성되었습니다.' };
      return { suuccess: false, msg: '글이 스크랩되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async updateOneByScrapNum() {
    const { scrapNum } = this.params;
    const data = this.body;

    try {
      if (!data.title) {
        return { success: false, msg: '제목이 존재하지 않습니다.' };
      }

      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        scrapNum,
        'scraps'
      );

      if (!writerCheck.success) return writerCheck;

      const boardDescription = await MyPageStorage.findBoardDescription(
        scrapNum
      );

      const descriptions = data.description + boardDescription;

      const imgReg = /<img[^>]*src=(["']?([^>"']+)["']?[^>]*)>/gi;

      imgReg.test(descriptions);

      const fileUrl = RegExp.$2;

      const scrapInfo = {
        scrapNum,
        title: data.title,
        description: data.description,
        fileUrl,
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
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        scrapNum,
        'scraps'
      );

      if (!writerCheck.success) return writerCheck;

      const scrap = await MyPageStorage.deleteOneByScrapNum(scrapNum);

      if (scrap) return { success: true, msg: '글이 삭제되었습니다.' };
      return { success: false, msg: '글이 삭제되지 않았습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = MyPage;

'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Auth = require('../Auth/Auth');
const WriterCheck = require('../../utils/WriterCheck');
const AdminOptionStorage = require('../AdminOption/AdminOptionStorage');
const StudentStorage = require('../Student/StudentStorage');
const Error = require('../../utils/Error');

class MyPage {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
  }

  async findAllScrapsAndMyPagePosts() {
    const { id } = this.auth;
    const { clubNum } = this.params;

    try {
      if (params.id !== id) {
        return { succeess: false, msg: '본인만 열람 가능합니다.' };
      }

      if (!(await MyPageStorage.existClub(clubNum))) {
        return { success: false, msg: '존재하지 않는 동아리입니다.' };
      }

      const scraps = await MyPageStorage.findAllScraps({ id, clubNum });
      const myPagePosts = await MyPageStorage.findAllMyPagePosts({
        id,
        clubNum,
      });

      if (scraps || myPagePosts) {
        return { success: true, msg: '전체 글 조회 성공', scraps, myPagePosts };
      }
      return { success: true, msg: '글 내역이 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findAllBoardsAndComments() {
    const { id } = this.params;

    try {
      if (id !== this.auth.id) {
        return { success: false, msg: '본인만 열람 가능합니다.' };
      }

      const { boards, comments } = await MyPageStorage.findAllBoardsAndComments(
        id
      );

      if (boards.length || comments.length) {
        return {
          success: true,
          msg: '작성글 및 댓글 내역 조회 성공',
          boards,
          comments,
        };
      }
      return { success: true, msg: '작성글 및 댓글 내역이 존재하지 않습니다.' };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }

  async findOneScrap() {
    const { params } = this;

    try {
      const userInfo = {
        id: params.id,
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

  async deleteOneByJoinedClub() {
    const user = this.auth;
    const { clubNum } = this.params;
    const { id } = this.params;

    try {
      if (user.id !== id) {
        return {
          success: false,
          msg: '로그인 계정과 삭제 요청자가 일치하지 않습니다.',
        };
      }
      if (!user.clubNum.includes(Number(clubNum))) {
        return { success: false, msg: '가입된 동아리가 아닙니다.' };
      }

      const userInfo = {
        memberId: user.id,
        clubNum: Number(clubNum),
      };

      const clubLeader = await MyPageStorage.findOneByClubLeader(userInfo);

      if (!clubLeader) {
        const isUpdate = await AdminOptionStorage.updateReadingFlagById(
          userInfo
        );

        if (!isUpdate) {
          return {
            success: false,
            msg: '동아리 탈퇴에 실패하였습니다. 관리자에게 문의해주세요.',
          };
        }

        const isDelete = await AdminOptionStorage.deleteMemberById(userInfo);

        if (!isDelete) {
          return { success: false, msg: '동아리 탈퇴에 실패하였습니다.' };
        }
        const checkedId = await StudentStorage.findOneById(user.id);
        const clubs = await StudentStorage.findOneByLoginedId(user.id);
        const jwt = await Auth.createJWT(checkedId, clubs);

        return { success: true, msg: '동아리 탈퇴에 성공하였습니다.', jwt };
      }
      return {
        success: false,
        msg: '동아리 회장은 탈퇴가 불가능합니다. 회장을 위임한 후 탈퇴해주세요.',
      };
    } catch (err) {
      return Error.ctrl('개발자에게 문의해주세요.', err);
    }
  }
}

module.exports = MyPage;

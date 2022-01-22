'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Auth = require('../Auth/Auth');
const WriterCheck = require('../../utils/WriterCheck');
const AdminOptionStorage = require('../AdminOption/AdminOptionStorage');
const StudentStorage = require('../Student/StudentStorage');
const Error = require('../../utils/Error');
const MyPageUtil = require('./MyPageUtils');
const { makeResponse } = require('./MyPageUtils');

class MyPage {
  constructor(req) {
    this.body = req.body;
    this.auth = req.auth;
    this.params = req.params;
  }

  async findAllScrapsAndMyPagePosts() {
    const { id } = this.auth;
    const { clubNum } = this.params;

    if (this.params.id !== id) {
      return makeResponse(403, '본인만 열람 가능합니다.');
    }

    try {
      if (!(await MyPageStorage.existClub(clubNum))) {
        return makeResponse(404, '존재하지 않는 동아리입니다.');
      }

      const scraps = await MyPageStorage.findAllScraps({ id, clubNum });
      const myPagePosts = await MyPageStorage.findAllMyPagePosts({
        id,
        clubNum,
      });

      if (scraps || myPagePosts) {
        return makeResponse(200, '전체 글 조회 성공', { scraps, myPagePosts });
      }
      return makeResponse(200, '글 내역이 존재하지 않습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findOneScrap() {
    const { params } = this;
    const userInfo = {
      id: params.id,
      scrapNum: params.scrapNum,
    };

    try {
      const scrap = await MyPageStorage.findOneScrap(userInfo);

      if (scrap) return makeResponse(200, '스크랩 상세 조회 성공', scrap);
      return makeResponse(404, '존재하지 않는 글입니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findAllBoardsAndComments() {
    if (this.params.id !== this.auth.id) {
      return makeResponse(403, '본인만 열람 가능합니다.');
    }

    try {
      const { boards, comments } = await MyPageStorage.findAllBoardsAndComments(
        id
      );

      if (boards.length || comments.length) {
        return makeResponse(200, '작성 글 및 댓글 내역 조회 성공', {
          boards,
          comments,
        });
      }
      return makeResponse(200, '작성글 및 댓글 내역이 존재하지 않습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async createScrapNum() {
    const scrapPost = this.body;

    if (!scrapPost.title) return makeResponse(400, '제목이 존재하지 않습니다.');

    const fileUrl = MyPageUtil.extractThumbnail(
      scrapPost.scrapDescription + scrapPost.boardDescription
    );

    const scrapInfo = {
      fileUrl,
      id: this.auth.id,
      clubNum: this.params.clubNum,
      title: scrapPost.title,
      scrapDescription: scrapPost.scrapDescription,
      boardDescription: scrapPost.boardDescription,
    };

    try {
      const scrap = await MyPageStorage.createScrapNum(scrapInfo);

      if (scrap) return makeResponse(201, '스크랩글이 생성되었습니다.');
      return makeResponse(400, '글이 스크랩되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async XXcreateScrapNum() {
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
      return Error.ctrl('', err);
    }
  }

  async updateOneByScrapNum() {
    const { scrapNum } = this.params;
    const scrpaPost = this.body;

    if (!scrpaPost.title) {
      return makeResponse(400, '제목이 존재하지 않습니다.');
    }

    try {
      const writerCheck = await WriterCheck.ctrl(
        this.auth.id,
        scrapNum,
        'scraps'
      );

      if (!writerCheck.success) return writerCheck;

      const boardDescription = await MyPageStorage.findBoardDescription(
        scrapNum
      );

      const descriptions = scrpaPost.description + boardDescription;

      const fileUrl = MyPageUtil.extractThumbnail(descriptions);

      const scrapInfo = {
        scrapNum,
        title: scrpaPost.title,
        description: scrpaPost.description,
        fileUrl,
      };

      const scrap = await MyPageStorage.updateOneByScrapNum(scrapInfo);

      if (scrap) return makeResponse(200, '글이 수정되었습니다.');
      return makeResponse(400, '글이 수정되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async xxupdateOneByScrapNum() {
    const { scrapNum } = this.params;
    const data = this.body;

    try {
      if (!data.title) return makeResponse(400, '제목이 존재하지 않습니다.');

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

      if (scrap) return makeResponse(200, '글이 수정되었습니다.');
      return makeResponse(400, '글이 수정되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
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

      if (scrap) return makeResponse(200, '글이 삭제되었습니다.');
      return makeResponse(400, '글이 삭제되지 않았습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async deleteOneByJoinedClub() {
    const user = this.auth;
    const { clubNum } = this.params;
    const { id } = this.params;

    try {
      if (user.id !== id) {
        return makeResponse(
          403,
          '로그인 계정과 삭제 요청자가 일치하지 않습니다.'
        );
      }
      if (!user.clubNum.includes(Number(clubNum))) {
        return makeResponse(403, '가입된 동아리가 아닙니다.');
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
          return makeResponse(
            400,
            '동아리 탈퇴에 실패하였습니다. 관리자에게 문의해주세요'
          );
        }

        const isDelete = await AdminOptionStorage.deleteMemberById(userInfo);

        if (!isDelete) {
          return makeResponse(400, '동아리 탈퇴에 실패하였습니다.');
        }
        const checkedId = await StudentStorage.findOneById(user.id);
        const clubs = await StudentStorage.findOneByLoginedId(user.id);
        const jwt = await Auth.createJWT(checkedId, clubs);

        return makeResponse(200, '동아리 탈퇴에 성공하였습니다.', jwt);
      }
      return makeResponse(
        400,
        '동아리 회장은 탈퇴가 불가능합니다. 회장을 위임한 후 탈퇴해주세요.'
      );
    } catch (err) {
      return Error.ctrl('', err);
    }
  }
}

module.exports = MyPage;

'use sctrict';

const MyPageStorage = require('./MyPageStorage');
const Auth = require('../Auth/Auth');
const WriterCheck = require('../../utils/WriterCheck');
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
    const user = this.auth;
    const { clubNum } = this.params;
    const userInfo = {
      clubNum,
      id: user.id,
    };

    if (this.params.id !== user.id) {
      return makeResponse(403, '본인만 열람 가능합니다.');
    }

    try {
      if (!(await MyPageStorage.existClub(clubNum))) {
        return makeResponse(404, '존재하지 않는 동아리입니다.');
      }

      const scraps = await MyPageStorage.findAllScraps(userInfo);
      const myPagePosts = await MyPageStorage.findAllMyPagePosts(userInfo);

      if (scraps || myPagePosts) {
        return makeResponse(200, '전체 글 조회 성공', { scraps, myPagePosts });
      }
      return makeResponse(200, '글 내역이 존재하지 않습니다.');
    } catch (err) {
      return Error.ctrl('', err);
    }
  }

  async findOneScrap() {
    const userInfo = {
      id: this.params.id,
      scrapNum: this.params.scrapNum,
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
    const user = this.auth;

    if (this.params.id !== user.id) {
      return makeResponse(403, '본인만 열람 가능합니다.');
    }

    try {
      const boards = await MyPageStorage.findAllBoards(user.id);
      const comments = await MyPageStorage.findAllComments(user.id);

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

  async updateOneByScrapNum() {
    const { scrapNum } = this.params;
    const scrapPost = this.body;

    if (!scrapPost.title) {
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

      const fileUrl = MyPageUtil.extractThumbnail(
        scrapPost.description + boardDescription
      );

      const scrapInfo = {
        scrapNum,
        fileUrl,
        title: scrapPost.title,
        description: scrapPost.description,
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
    const userInfo = {
      clubNum,
      id: user.id,
    };

    if (user.id !== this.params.id) {
      return makeResponse(
        403,
        '로그인 계정과 삭제 요청자가 일치하지 않습니다.'
      );
    }
    if (!user.clubNum.includes(Number(clubNum))) {
      return makeResponse(403, '가입된 동아리가 아닙니다.');
    }

    try {
      const clubLeader = await MyPageStorage.findClubLeader(userInfo);

      if (!clubLeader) {
        const isUpdate = await MyPageStorage.updateRejectedApplicant(userInfo);

        const isDelete = await MyPageStorage.deleteMemberById(userInfo);

        if (!isUpdate || !isDelete) {
          return makeResponse(400, '동아리 탈퇴에 실패하였습니다.');
        }
        const checkedId = await MyPageStorage.findUserInfoById(user.id);
        const clubs = await MyPageStorage.findJoinedClubsById(user.id);
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

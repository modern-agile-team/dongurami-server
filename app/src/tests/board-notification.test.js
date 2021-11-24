const request = require('supertest');
const app = require('../../app');

const server = request(app);

const clubNotice = {
  title: '동아리 공지 알림 생성 테스트',
  description: '테스트테스트테스트',
  images: [],
  url: 'clubNotice/notification/test',
  notiCategoryNum: 6,
};

const cmt = {
  description: '댓글 테스트입니다.',
  url: 'cmt/test/url',
  notiCategoryNum: 0,
  hiddenFlag: 1,
};

const replyCmt = {
  description: '답글 테스트입니다.',
  url: 'reply/test/url',
  notiCategoryNum: 1,
  hiddenFlag: 1,
};

const boardEmotion = {
  url: 'emotion/notification/test',
  notiCategoryNum: 9,
};

const cmtEmotion = {
  url: 'emotion/notification/test',
  notiCategoryNum: 10,
};

const replyEmotion = {
  url: 'emotion/notification/test',
  notiCategoryNum: 11,
};

const leaderToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxNzA4MDUxIiwibmFtZSI6IuuvvOyInOq4sCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.7_ZLVQVSiSEBFaZ2uKmcDMlXb22Qvi13--H3lSVio9Q';

const memberToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs';

describe('게시판 관련 알림 API 테스트', () => {
  it('POST 동아리 공지 글 알림생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2')
        .set('x-auth-token', memberToken)
        .set('Content-Type', 'application/json')
        .send(clubNotice);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 댓글알림 생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2/26')
        .set('x-auth-token', leaderToken)
        .set('Content-Type', 'application/json')
        .send(cmt);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 답글알림 생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2/26/126')
        .set('x-auth-token', memberToken)
        .set('Content-Type', 'application/json')
        .send(replyCmt);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('PATCH 게시글에 좋아요 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .patch('/api/emotion/liked/board/26')
        .set('x-auth-token', leaderToken)
        .set('Content-Type', 'application/json')
        .send(boardEmotion);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('PATCH 댓글에 좋아요 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .patch('/api/emotion/liked/comment/278')
        .set('x-auth-token', memberToken)
        .set('Content-Type', 'application/json')
        .send(cmtEmotion);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('PATCH 답글에 좋아요 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .patch('/api/emotion/liked/reply-comment/281')
        .set('x-auth-token', memberToken)
        .set('Content-Type', 'application/json')
        .send(replyEmotion);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
});

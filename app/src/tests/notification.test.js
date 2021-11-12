const request = require('supertest');
const app = require('../../app');

const server = request(app);

const comment = {
  description: '댓글 테스트!! 이 댓글은 지우지 마세요 -김지수-',
  notiCategoryNum: 0,
  url: 'test/url',
};

const reply = {
  description: '답글 테스트!! 이 댓글은 지우지 마세요 -김지수-',
  notiCategoryNum: 1,
  url: 'test/url',
};

const clubAdmin = {
  applicant: '000000011',
};

describe('알림 API 테스트', () => {
  it('POST 댓글알림 생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2/1')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjoiWzJdIiwiaWQiOiIwMDAwMDAwMDYiLCJuYW1lIjoi7Jes7ISvIiwicHJvZmlsZVBhdGgiOm51bGwsImlzQWRtaW4iOjAsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.lUOA0roMJMWga0JnWPZEfAVgBch49LVhtibaBLV78Wg'
        )
        .set('Content-Type', 'application/json')
        .send(comment);
      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 답글알림 생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2/1/1')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(reply);
      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 동아리 가입승인 알림생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/admin-option/2/applicant')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(clubAdmin);
      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('PUT 동아리 가입승인 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/admin-option/2/applicant')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(clubAdmin);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('GET 알림조회 성공 시 200 반환', async () => {
    try {
      const res = await server
        .get('/api/notification/entire')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
});

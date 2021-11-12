const request = require('supertest');
const app = require('../../app');

const server = request(app);

const comment = {
  description: '댓글 테스트!! 이 댓글은 지우지 마세요. -김지수-',
  url: 'test/url',
  notiCategoryNum: 0,
};

const reply = {
  description: '답글 테스트!! 이 댓글은 지우지 마세요. -김지수-',
  url: 'test/url',
  notiCategoryNum: 1,
};

const apply = {
  applicant: '000000011',
  url: 'test/url',
  notiCategoryNum: 2,
};

const reject = {
  applicant: '000000011',
  url: 'test/url',
  notiCategoryNum: 3,
};

const createSchedule = {
  title: '알림생성 테스트!! 이 일정은 지우지 마세요. -김지수-',
  colorCode: '#123456',
  startDate: '2021-11-12',
  endDate: '2021-11-12',
  url: 'schedule/notification/test',
  notiCategoryNum: 4,
};

const modifySchedule = {
  title: '알림수정 테스트!! 이 일정은 지우지 마세요. -김지수-',
  colorCode: '#123456',
  startDate: '2021-11-12',
  endDate: '2021-11-12',
  url: 'schedule/notification/test',
  notiCategoryNum: 5,
};

const clubNotice = {
  title: '동아리 공지 알림 생성 테스트 !! 이 글은 지우지 마세요. -김지수-',
  description: '동아리 공지 알림 생성 테스트',
  images: [],
  url: 'clubNotice/notification/test',
  notiCategoryNum: 6,
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
        .send(apply);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('PUT 동아리 가입거절 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/admin-option/2/applicant')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(reject);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 동아리 일정 알림생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/schedule/2')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(modifySchedule);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('PUT 동아리 일정 수정 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/schedule/2/1')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(createSchedule);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('POST 동아리 공지 글 알림생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/board/clubNotice/2')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(clubNotice);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('GET 알림 조회 시 200 반환', async () => {
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

  it('PATCH 알림 삭제 시 200 반환', async () => {
    try {
      const res = await server
        .patch('/api/notification/1')
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

  it('PUT 전체 알림 삭제 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/notification/entire')
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

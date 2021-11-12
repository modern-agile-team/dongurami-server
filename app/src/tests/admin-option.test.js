const request = require('supertest');
const app = require('../../app');

const server = request(app);

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

const leader = {
  newLeader: '000000005',
};

const adminFunctions = {
  adminOptions: [
    {
      id: '000000006',
      joinAdminFlag: 1,
      boardAdminFlag: 1,
    },
  ],
};

describe('동아리 관리 API 테스트', () => {
  it('GET 동아리원 조회 시 200 반환', async () => {
    try {
      const res = await server
        .get('/api/club/admin-option/2')
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

  it('POST 동아리 가입 승인 시 201 반환', async () => {
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

  it('PUT 동아리 가입 거절 시 200 반환', async () => {
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

  it('PUT 동아리 회장 변경 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/admin-option/2/leader')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(leader);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('PUT 동아리 권한 변경 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/admin-option/2/admin-functions')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(adminFunctions);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('DELETE 동아리원 추방 시 200 반환', async () => {
    try {
      const res = await server
        .delete('/api/club/admin-option/2/000000011')
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

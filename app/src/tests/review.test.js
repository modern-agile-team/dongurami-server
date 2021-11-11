const request = require('supertest');
const app = require('../../app');

const server = request(app);

const review = {
  description: '너무 재밌어요!!',
  score: '5',
};

describe('동아리 후기 API 테스트', () => {
  it('POST 후기 작성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/review/2')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMDAwMDAwMDA1IiwibmFtZSI6IuuLpOyEryIsInByb2ZpbGVQYXRoIjpudWxsLCJpc0FkbWluIjowLCJpYXQiOjE2MzY2MzM4MjMsImV4cCI6MTYzNjcyMDIyMywiaXNzIjoid29vYWhhbiBhZ2lsZSJ9.nWkuNJp0Odo-y3on9VV18XDoTEgxvnuNOKyskPEM4Fg'
        )
        .set('Content-Type', 'application/json')
        .send(review);
      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });
});

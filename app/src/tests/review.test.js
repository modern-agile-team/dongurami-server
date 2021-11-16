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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(review);

      expect(res.statusCode).toEqual(201);
    } catch (err) {
      console.log(err);
    }
  });

  it('GET 모든 후기 보여줄 시 200 반환', async () => {
    try {
      const res = await server
        .get('/api/club/review/2')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(review);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('PUT 후기 수정 성공 시 200 반환', async () => {
    try {
      const res = await server
        .put('/api/club/review/2/27')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(review);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('DELETE 후기 삭제 성공 시 200 반환', async () => {
    try {
      const res = await server
        .delete('/api/club/review/2/27')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(review);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
});

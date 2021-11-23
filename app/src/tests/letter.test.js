const request = require('supertest');
const app = require('../../app');

const server = request(app);

const letter = {
  recipientId: '202016720',
  description: '쪽지 테스트(jest)',
  boardNo: 38,
  commentNO: '',
  boardFlag: 1,
  writerHiddenFlag: 1,
};

describe('쪽지 API 테스트', () => {
  it('POST 쪽지 생성 test => 201 반환', async () => {
    const res = await server
      .post('/api/letter')
      .set(
        'x-auth-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTA4MDUzIiwibmFtZSI6Iuq0gOumrOyekF_rpZjqsIDtnawiLCJwcm9maWxlUGF0aCI6Imh0dHBzOi8vZDE5bG14YXF2Ym9qemcuY2xvdWRmcm9udC5uZXQvMjBkNmFjM2VkOF8xNjM1MzkwMTMyMzI2LlBORyIsImlzQWRtaW4iOjEsImlhdCI6MTYzNzU0Nzk5MCwiZXhwIjoxNjM3NjM0MzkwLCJpc3MiOiJ3b29haGFuIGFnaWxlIn0.JVU7cLGy5uJJNcMAb4aqz8koNN2yYiEvh8STIcsWmVY'
      )
      .set('Content-Type', 'application/json')
      .send(letter);

    expect(res.statusCode).toEqual(201);
  });
});

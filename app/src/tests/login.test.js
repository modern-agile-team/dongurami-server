const request = require('supertest');
const app = require('../../app'); // 서버 가져오기

const server = request(app); // 요청보내기위한 모듈

const existAccount = {
  id: '201416071',
  password: 'ckdgns12!@',
};
const unExistAccount = {
  id: 'xxxxxxxxx',
  password: '1234',
};
const wrongPwAccount = {
  id: '201416071',
  password: 'xxxxxxxx',
};
const blanckIdAndPw = {
  id: '',
  password: '',
};

describe('POST 로그인 테스트', () => {
  it('POST SUCCESS  로그인 테스트 [200]', async () => {
    const res = await server
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(existAccount);

    expect(res.statusCode).toStrictEqual(200);
  });

  it('POST ID(X) / PW(?)  로그인 테스트 [401]', async () => {
    const res = await server
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(unExistAccount);

    expect(res.statusCode).toStrictEqual(401);
  });

  it('POST ID(O) / PW(X)  로그인 테스트 [401]', async () => {
    const res = await server
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(wrongPwAccount);

    expect(res.statusCode).toStrictEqual(401);
  });

  it('POST ID, PW 공백 로그인테스트[400]', async () => {
    const res = await server
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(blanckIdAndPw);

    expect(res.statusCode).toStrictEqual(400);
  });
});

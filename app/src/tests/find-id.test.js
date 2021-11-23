const request = require('supertest');
const app = require('../../app');

const server = request(app);

const normalNameAndEmail = {
  name: '관리자_오창훈',
  email: 'dhckdgns3@naver.com',
};

const wrongEmail = {
  name: '관리자_오창훈',
  email: 'xxxxx@naver.com',
};

const wrongName = {
  name: 'xxx',
  email: 'dhckdgns3@naver.com',
};

const blankName = {
  name: '',
  email: 'dhckdgns3@naver.com',
};
const blankEamil = {
  name: '관리자_오창훈',
  email: '',
};
const blankNameOrEamil = {
  name: '',
  email: '',
};

describe('POST 아이디찾기 테스트', () => {
  it('POST SUCCESS 아이디찾기 테스트 [200]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(normalNameAndEmail);

    expect(res.statusCode).toStrictEqual(200);
  });

  it('POST NAME(O) / EMAIL(X) 테스트 [400]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(wrongEmail);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST NAME(X) / EMAIL(O) 테스트 [400]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(wrongName);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST NAME, EMAIL공백 테스트 [400]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(blankNameOrEamil);

    expect(res.statusCode).toStrictEqual(400);
  });
  it('POST NAME 공백 / EMAIL(O) 테스트 [400]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(blankName);

    expect(res.statusCode).toStrictEqual(400);
  });
  it('POST NAME(O) / EMAIL 공백 테스트 [400]', async () => {
    const res = await server
      .post('/api/find-id')
      .set('Content-Type', 'application/json')
      .send(blankEamil);

    expect(res.statusCode).toStrictEqual(400);
  });
});

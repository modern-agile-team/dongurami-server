const request = require('supertest');
const app = require('../../app');

const server = request(app);

const normalSignUpCase = {
  id: '203316088', // id : 9자리 숫자로 이루어진 학번 (중복 X)
  password: 'ckdgns12!@', // password : 8자리 이상
  name: '오창훈',
  email: 'dhckdgns4@naver.com', // eamil : 이메일양식에 맞는 이메일 (중복 X)
  major: '정보통신공학과', // 프론트 단 드롭다운박스 선택
};
const duplicateId = {
  id: '201416071',
  password: 'ckdgns12!@',
  name: '오창훈',
  email: 'dhckdgns4@naver.com',
  major: '정보통신공학과',
};
const blankId = {
  id: '',
  password: 'ckdgns12!@',
  name: '오창훈',
  email: 'dhckdgns4@naver.com',
  major: '정보통신공학과',
};
const abnormalId = {
  id: '123123',
  password: 'ckdgns12!@',
  name: '오창훈',
  email: 'dhckdgns4@naver.com',
  major: '정보통신공학과',
};

const blankPassword = {
  id: '201416074',
  password: '',
  name: '오창훈',
  email: '',
  major: '정보통신공학과',
};
const abnormalPassword = {
  id: '201416074',
  password: '123123',
  name: '오창훈',
  email: '123naver.com',
  major: '정보통신공학과',
};
const abnormalName = {
  id: '201416074',
  password: 'ckdgns12!@',
  name: '오  창훈',
  email: '123naver.com',
  major: '정보통신공학과',
};
const duplicateEmail = {
  id: '201416071',
  password: 'ckdgns12!@',
  name: '오창훈',
  email: 'dhckdgns4@naver.com',
  major: '정보통신공학과',
};
// const blankEmail = {
//   id: '201416074',
//   password: 'ckdgns12!@',
//   name: '오창훈',
//   email: '',
//   major: '정보통신공학과',
// };
const abnormalEmail = {
  id: '201416074',
  password: 'ckdgns12!@',
  name: '오창훈',
  email: '123naver.com',
  major: '정보통신공학과',
};

describe('POST 회원가입 테스트', () => {
  it('POST [MiddleWare] 중복ID [409]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(duplicateId);

    expect(res.statusCode).toStrictEqual(409);
  });

  it('POST [MiddleWare] 공백 ID [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(blankId);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST [MiddleWare] 자릿수 안맞는 ID [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(abnormalId);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST [MiddleWare] 공백 PASSWORD [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(blankPassword);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST [MiddleWare] 자릿수 안맞는 PASSWORD [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(abnormalPassword);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST [MiddleWare] 자릿수 안맞는 NAME [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(abnormalName);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST 중복 EMAIL [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(duplicateEmail);

    expect(res.statusCode).toStrictEqual(409);
  });

  it('POST [MiddleWare] 양식 안맞는 EMAIL [400]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(abnormalEmail);

    expect(res.statusCode).toStrictEqual(400);
  });

  it('POST SUCCESS 회원가입 테스트 [201]', async () => {
    const res = await server
      .post('/api/sign-up')
      .set('Content-Type', 'application/json')
      .send(normalSignUpCase);

    expect(res.statusCode).toStrictEqual(201);
  });
});

const request = require('supertest');
const app = require('../../app');

const server = request(app);

const application = {
  basic: {
    grade: 1,
    gender: 2,
    phoneNum: '01012121212',
  },

  extra: [
    {
      no: 6,
      description: '테스트1',
    },
    {
      no: 7,
      description: '테스트2',
    },
    {
      no: 8,
      description: '테스트3',
    },
    {
      no: 9,
      description: '테스트4',
    },
    {
      no: 10,
      description: '테스트5',
    },
    {
      no: 11,
      description: '테스트6',
    },
  ],
  notiCategoryNum: '7',
  url: 'test/url',
};

const apply = {
  applicant: '200010255',
  url: 'test/url',
  notiCategoryNum: 2,
};

const reject = {
  applicant: '200010255',
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

describe('알림 API 테스트', () => {
  it('POST 동아리 가입신청 알림생성 시 201 반환', async () => {
    try {
      const res = await server
        .post('/api/club/application/2/answer')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbXSwiaWQiOiIyMDAwMTAyNTUiLCJuYW1lIjoi7KeA7IiY7YWM7Iqk7Yq4IiwicHJvZmlsZVBhdGgiOiJza2RmaCIsImlzQWRtaW4iOiIxIiwiYWxnb3JpdGhtIjoiSFMyNTYiLCJpc3N1ZXIiOiJ3b29haGFuIGFnaWxlIn0.rfry4MDUAdxr_xnF0iE6Dyxe-ZyQnTL6CYU7YTtkCkM'
        )
        .set('Content-Type', 'application/json')
        .send(application);

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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(reject);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('DELETE 동아리 탈퇴 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .delete('/api/my-page/200010255/personal/2')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAwMDEwMjU1IiwibmFtZSI6IuyngOyImO2FjOyKpO2KuCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.gnPLoRHrkVCQnB3cKWJ6swDZM105GcNeCAS95tA5QOU'
        )
        .set('Content-Type', 'application/json');

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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(createSchedule);

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });

  it('PATCH 게시글에 좋아요 알림생성 시 200 반환', async () => {
    try {
      const res = await server
        .patch('/api/emotion/liked/board/26')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxNzA4MDUxIiwibmFtZSI6IuuvvOyInOq4sCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.7_ZLVQVSiSEBFaZ2uKmcDMlXb22Qvi13--H3lSVio9Q'
        )
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
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
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
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json')
        .send(replyEmotion);

      expect(res.statusCode).toEqual(200);
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
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
        .patch('/api/notification/4449')
        .set(
          'x-auth-token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHViTnVtIjpbMl0sImlkIjoiMjAxOTE2MDIyIiwibmFtZSI6Iuq5gOyngOyImCIsInByb2ZpbGVQYXRoIjoic2tkZmgiLCJpc0FkbWluIjoiMSIsImFsZ29yaXRobSI6IkhTMjU2IiwiaXNzdWVyIjoid29vYWhhbiBhZ2lsZSJ9.4A9OfY-QLvOUvZQT-TtpJ-zD2ya7k3WDblVnZ4orqCs'
        )
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
    }
  });
});

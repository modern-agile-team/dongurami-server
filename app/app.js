'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./src/config/logger');

const app = express();
dotenv.config();

const options = {
  origin: ['https://dongurami.co.kr', 'http://dongurami.co.kr'],
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(options));
app.use(morgan(':method :status :response-time ms', { stream: logger.stream }));

const adminOption = require('./src/apis/admin-option');
const application = require('./src/apis/application');
const board = require('./src/apis/board');
const clubBoard = require('./src/apis/club-board');
const clubList = require('./src/apis/club-list');
const comment = require('./src/apis/comment');
const emotion = require('./src/apis/emotion');
const home = require('./src/apis/home');
const image = require('./src/apis/image');
const letter = require('./src/apis/letter');
const myPage = require('./src/apis/my-page');
const naver = require('./src/apis/naver');
const notification = require('./src/apis/notification');
const profile = require('./src/apis/profile');
const review = require('./src/apis/review');
const root = require('./src/apis/root');
const s3 = require('./src/apis/s3');
const schedule = require('./src/apis/schedule');
const search = require('./src/apis/search');

app.use('/api/club/admin-option', adminOption);
app.use('/api/club/application', application);
app.use('/api/board', board);
app.use('/api/club/board', clubBoard);
app.use('/api/club/list', clubList);
app.use('/api/comment', comment);
app.use('/api/emotion', emotion);
app.use('/api/club/home', home);
app.use('/api/image', image);
app.use('/api/letter', letter);
app.use('/api/my-page', myPage);
app.use('/api/naver', naver);
app.use('/api/notification', notification);
app.use('/api/profile', profile);
app.use('/api/club/review', review);
app.use('/api', root);
app.use('/api/s3', s3);
app.use('/api/club/schedule', schedule);
app.use('/api/search', search);

module.exports = app;

'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./src/config/logger');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(':method :status :response-time ms', { stream: logger.stream }));

const board = require('./src/apis/boards');
const root = require('./src/apis/root');
const review = require('./src/apis/review');
const home = require('./src/apis/circle-home');
const schedule = require('./src/apis/schedule');
const clubList = require('./src/apis/club');
const application = require('./src/apis/application');
const clubBoard = require('./src/apis/club-board');
const adminOption = require('./src/apis/admin-option');
const search = require('./src/apis/search');
const myPage = require('./src/apis/my-page');
const profile = require('./src/apis/profile');
const notification = require('./src/apis/notification');

app.use('/api/board', board);
app.use('/api', root);
app.use('/api/club/review', review);
app.use('/api/club/home', home);
app.use('/api/club/schedule', schedule);
app.use('/api/club/list', clubList);
app.use('/api/club/application', application);
app.use('/api/club/board', clubBoard);
app.use('/api/club/admin-option', adminOption);
app.use('/api/search', search);
app.use('/api/my-page', myPage);
app.use('/api/profile', profile);
app.use('/api/notification', notification);

module.exports = app;

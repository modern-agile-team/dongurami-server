'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const board = require('./src/apis/boards');
const root = require('./src/apis/root');
const review = require('./src/apis/review');
const home = require('./src/apis/circle-home');
const schedule = require('./src/apis/schedule');
const clubList = require('./src/apis/club');
const application = require('./src/apis/application');
const adminOption = require('./src/apis/admin-option');
const search = require('./src/apis/search');

app.use('/api/board', board);
app.use('/api', root);
app.use('/api/club/review', review);
app.use('/api/club/home', home);
app.use('/api/club/schedule', schedule);
app.use('/api/club/list', clubList);
app.use('/api/club/application', application);
app.use('/api/club/admin-option', adminOption);
app.use('/api/search', search);

module.exports = app;

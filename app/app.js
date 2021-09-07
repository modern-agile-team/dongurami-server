'use strict';

const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const signUp = require('./src/apis/sign-up');
const login = require('./src/apis/login');
const review = require('./src/apis/review');
const home = require('./src/apis/circle-home');
const schedule = require('./src/apis/schedule');
const findId = require('./src/apis/find-id');

app.use('/api', signUp);
app.use('/api', login);
app.use('/api/club/review', review);
app.use('/api/club', home);
app.use('/api/club/schedule', schedule);
app.use('/api', findId);

module.exports = app;

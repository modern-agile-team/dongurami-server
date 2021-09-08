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
const findId = require('./src/apis/find-id');
const findPassword = require('./src/apis/find-password');
const resetPassword = require('./src/apis/reset-password');

app.use('/api', signUp);
app.use('/api', login);
app.use('/api/club/review', review);
app.use('/api/club', home);
app.use('/api', findId);
app.use('/api', findPassword);
app.use('/api', resetPassword);

module.exports = app;

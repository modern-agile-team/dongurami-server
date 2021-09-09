'use strict';

const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const root = require('./src/apis/root');
const review = require('./src/apis/review');
const home = require('./src/apis/circle-home');

app.use('/api', root);
app.use('/api/club/review', review);
app.use('/api/club/home', home);

module.exports = app;

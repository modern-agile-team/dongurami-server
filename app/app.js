const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = require('./src/apis/root');
const review = require('./src/apis/review');
const home = require('./src/apis/circle-home');

app.use('/api', auth);
app.use('/api/club/review', review);
app.use('/api/club', home);

module.exports = app;

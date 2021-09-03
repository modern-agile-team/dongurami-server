const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const home = require('./src/apis/CircleHome');
const review = require('./src/apis/review');

app.use('/api/club/review', review);
app.use('/api/club', home);
module.exports = app;

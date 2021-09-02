const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const review = require('./src/apis/review');

app.use('/api/club/review', review);

module.exports = app;

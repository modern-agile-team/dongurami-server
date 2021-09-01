const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const board = require('./src/apis/boards');

app.use('/api/board', board);

module.exports = app;

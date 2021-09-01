const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const root = require('./src/apis/CircleHome');

app.use('/', root);
module.exports = app;

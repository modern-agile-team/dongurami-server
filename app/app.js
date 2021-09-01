const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Home = require('./src/apis/CircleHome');

app.use('/api/club', Home);
module.exports = app;

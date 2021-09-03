const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Home = require('./src/apis/CircleHome');
const review = require('./src/apis/review');

app.use('/api/club/review', review);
app.use('/api/club', Home);
module.exports = app;

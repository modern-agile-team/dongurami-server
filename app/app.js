const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const signUp = require('./src/apis/sign-up');
const login = require('./src/apis/login');
const review = require('./src/apis/review');

app.use('/api', signUp);
app.use('/api', login);
app.use('/api/club/review', review);

module.exports = app;

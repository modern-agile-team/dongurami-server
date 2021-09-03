const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = require('./src/apis/root');
const signUp = require('./src/apis/sign-up');
const review = require('./src/apis/review');

app.use('/api/auth', auth);
app.use('/api', signUp);
app.use('/api/club/review', review);

module.exports = app;

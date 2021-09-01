const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
const Home = require('./src/apis/CircleHome');

app.use('/api/club/', Home);
=======
const review = require('./src/apis/review');


app.use('/api/club/review', review);

>>>>>>> 89660626ad4020a7c7315342b104c484b4e61aff
module.exports = app;

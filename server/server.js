//server/server.js
const express = require('express');
const router = require('./routes/routes.js');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

//Initialize secrets for api/database calls.
require('dotenv').config();

//Set ejs as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
//all client folder materials as static assets
app.use(express.static(path.join(__dirname, '../client')));
//assist in parsing requests.
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
//Connect to mongodb database.
try {
	mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURI}`);
} catch(err){
	throw err;
}


app.use('/', router);

module.exports = app;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

var app = express();

//Middleware
var router = require('./services/router');
var db = require('./db');
var accessLogStream = fs.createWriteStream(path.join(__dirname, '.access.log'), {flags:'a'});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

app.use(function(req, res, next){
    return res.render('index');
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
    console.log("Express started on port: ", app.get('port'));
});
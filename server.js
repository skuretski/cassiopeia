const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');

var app = express();

//Middleware
var router = require('./services/router');
var db = require('./db');
//Logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, '.access.log'), {flags:'a'});
app.use(morgan('dev', {stream: accessLogStream}));

//View Engine (Express Handlebars)
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Allowing CORS
const allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, X-Requested-With, Accept');
    next();
}

//Hooking up router
app.use(allowCrossDomain);
app.use('/', router);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log("Express started on port: ", app.get('port'));
});

module.exports = app;
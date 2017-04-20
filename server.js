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
app.use(morgan('combined', {stream: accessLogStream}));

//View Engine (Express Handlebars)
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Hooking up router
app.use('/', router);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function(){
    console.log("Express started on port: ", app.get('port'));
});
const mysql = require('mysql');
const config = require('../config/');

var connection = mysql.createConnection({
    host: config.dbURI,
    user: config.dbUser,
    password: config.dbPass,
    database: config.database
});

connection.connect(function(err){
    if(err){
        console.log("Error: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as ID: " + connection.threadId);
});

module.exports = connection;
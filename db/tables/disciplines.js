const connection = require('../../db/index');

exports.selectAllDisciplines = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `disciplines`',
        timeout: 40000 //40seconds
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
            console.log(results);
            res.json(results);
        }
    });
};

exports.selectDisciplineById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `disciplines` WHERE `id` = ?',
        timeout: 40000,
        values: req.params.id
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
            console.log(results);
            res.json(results);
        }
    });
};

exports.addDiscipline = function(req, res, next){
    var post = {
        title: req.body.title,
        description: req.body.description
    }
    connection.query({
        sql: 'INSERT INTO `disciplines` SET ?',
        timeout: 40000,
        values: post
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
            console.log(results);
            res.json(results);
        }
    });
};
const connection = require('../../db/index');

exports.selectAllAssignments = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `assignments`',
        timeout: 40000 //40seconds
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
            res.json(results);
        }
    });
};

exports.selectAssignmentById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `assignments` WHERE `id` = ?',
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
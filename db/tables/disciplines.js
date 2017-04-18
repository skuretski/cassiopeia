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

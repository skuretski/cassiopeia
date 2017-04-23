const connection = require('../../db/index');

exports.selectAllEmployees = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `employees`',
        timeout: 40000 //40seconds
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
   //         console.log(results);
            res.json(results);
        }
    });
};

exports.selectEmployeeById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `employees` WHERE `id` = ?',
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

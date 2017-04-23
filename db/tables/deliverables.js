const connection = require('../../db/index');

exports.selectAllDeliverables = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `deliverables`',
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

exports.selectDeliverableById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `deliverables` WHERE `id` = ?',
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
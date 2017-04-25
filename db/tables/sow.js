const connection = require('../../db/index');

exports.selectAllSow = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `sow`',
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

exports.selectSowById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `sow` WHERE `id` = ?',
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

exports.addSow = function(req, res, next){
    // TODO: Input validation
    var post = {
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        man_mo: req.body.man_mo,
        task_id: req.body.task_id
    }
    connection.query({
        sql: 'INSERT INTO `sow` SET ?',
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

const connection = require('../../db/index');

exports.selectAllFunding = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `funding`',
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

exports.selectFundingById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `funding` WHERE `id` = ?',
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

exports.addFunding = function(req, res, next){
    // TODO: Input validation
    var post = {
        source: req.body.source,
        type: req.body.type,
        amount: req.body.amount,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        acquired: req.body.acquired,
        project_id: req.body.project_id
    }
    connection.query({
        sql: 'INSERT INTO `funding` SET ?',
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

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

exports.selectFunding = function(req, res, next){
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
            res.json(results);
        }
    });
};

exports.addFunding = function(req, res, next){
    // TODO: Input validation
    var post = {
        type_id: req.body.type_id,
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
            res.json(results);
        }
    });
};

exports.updateFunding = function(req, res, next){
    // TODO: Input validation
    var put = {
        amount: req.body.amount,
        acquired: req.body.acquired,
    }
    connection.query({
        sql: 'UPDATE `funding` SET ? WHERE `id` = ?',
        timeout: 40000,
        values: [put, req.params.id]
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

exports.deleteFunding = function(req, res, next){
    connection.query({
        sql: 'DELETE FROM `funding` WHERE `id` = ? LIMIT 1',
        timeout: 40000,
        values: req.params.id
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

exports.selectFundingByProjectTypeAcquiredDate = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `funding` WHERE `type_id` = ? \
            AND `project_id` = ? AND `start_date` = ?',
        timeout: 40000,
        values: [req.query.type_id, req.query.project_id, req.query.start_date]
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
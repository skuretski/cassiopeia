const connection = require('../../db/index');

exports.selectAllSOW = function(req, res, next){
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

exports.selectSOW = function(req, res, next){
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
            res.json(results);
        }
    });
};

exports.addSOW = function(req, res, next){
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
            res.json(results);
        }
    });
};

exports.updateSOW = function(req, res, next) {
    // TODO: Input validation
    var put = {
        man_mo: req.body.man_mo,
    };
    connection.query({
        sql: 'UPDATE `sow` SET ? WHERE `id` = ?',
        timeout: 40000,
        values: [put, req.params.id]
    }, function(error, results) {
        if (error) {
            return res.json({ error });
        } else {
            res.json(results);
        }
    });
}

exports.deleteSOW = function(req, res, next){
    connection.query({
        sql: 'DELETE FROM `sow` WHERE `id` = ? LIMIT 1',
        timeout: 40000,
        values: req.params.id
    }, function(error, results){
        if(error){
            return res.json({ error });
        } else {
            res.json(results);
        }
    });
};

exports.selectSOWByTaskDate = function(req, res, next){
    connection.query({
        sql: 'SELECT id FROM `sow` WHERE `task_id` = ? AND `start_date` = ?',
        timeout: 40000,
        values: [req.query.task_id, req.query.start_date]
    }, function(error, results){
        if(error){
            return res.json({ error });
        } else {
            console.log(results);
            res.json(results);
        }
    });
};
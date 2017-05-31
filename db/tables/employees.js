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
            res.json(results);
        }
    });
};

exports.addEmployee = function(req, res, next){
    // TODO: Input validation
    var post = {
        first: req.body.first,
        last: req.body.last,
        discipline_id: req.body.discipline_id,
        active_start_date: req.body.active_start_date,
        active_end_date: req.body.active_end_date,
    }
    connection.query({
        sql: 'INSERT INTO `employees` SET ?',
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

exports.updateEmployee = function(req, res, next){
    // TODO: Input validation
    var put = {
        first: req.body.first,
        last: req.body.last,
        discipline_id: req.body.discipline_id,
        active_start_date: req.body.active_start_date,
        active_end_date: req.body.active_end_date,
    }
    connection.query({
        sql: 'UPDATE `employees` SET ? WHERE `id` = ?',
        timeout: 40000,
        values: [put, req.body.id]
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

exports.deleteEmployeeById = function(req, res, next){
    connection.query({
        sql: 'DELETE FROM `employees` WHERE `id` = ? LIMIT 1',
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

exports.selectEmployeesByDiscipline = function(req, res, next) {
    connection.query({
        sql: 'SELECT first, last, id FROM employees \
            WHERE discipline_id = ? \
            ORDER BY last ASC;',
        timeout: 40000,
        values: req.params.id
    }, function(error, results) {
        if (error) {
            return res.json({
                error: error
            });
        } else {
            res.json(results);
        }
    });
};
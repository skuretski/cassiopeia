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

exports.addAssignment = function(req, res, next){
    // TODO: Input validation
    var post = {
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        effort: req.body.effort,
        employee_id: req.body.employee_id,
        task_id: req.body.task_id
    }
    connection.query({
        sql: 'INSERT INTO `assignments` SET ?',
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

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

exports.selectAssignment = function(req, res, next){
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

function validateAssignment(assignment){
    return new Promise(function(resolve, reject){
        var errors = {
            start_date: false,
            end_date: false,
            effort: false,
            employee_id: false,
            task_id: false
        }
        if(Number.isNaN(assignment.effort) || assignment.effort == '' || assignment.effort == null){
            errors.effort = true;
        }
        // if(assignment.start_date == '' || assignment.start_date == null || Object.prototype.toString.call(assignment.start_date) !== "[object Date]"){
        //     console.log(assignment.start_date);
        //     console.log("Error: start date");
        //     errors.start_date = true;
        // }
        // if(assignment.end_date == '' || assignment.end_date == null || Object.prototype.toString.call(assignment.end_date) !== "[object Date]"){
        //     console.log("Error: end date");
        //     errors.end_date = true;
        // }
        if(assignment.end_date < assignment.start_date){
            errors.end_date = true;
            return reject("End date must be equal to or after start date.");
        }
        if(assignment.employee_id == '' || assignment.employee_id == null || !Number.isInteger(assignment.employee_id)){
            errors.employee_id = true;
            return reject("Employee ID must be an integer number.");
        }
        if(assignment.task_id == '' || assignment.task_id == null || !Number.isInteger(assignment.task_id)){
            errors.task_id = true;
            return reject("Task ID must be an integer.");
        }
        if(errors.effort || errors.employee_id || errors.task_id || errors.start_date || errors.end_date)
            return reject("Error in request parameters.");
    });
}

function getTasksById(taskId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT * FROM `tasks` WHERE `id` = ?',
            timeout: 40000,
            values: taskId
        }, function(error, results){
            if(error){
                return reject("Cannot get tasks.")
            } else{
                if(results.length == 0){
                    return reject("Cannot find task with that ID.")
                } else{
                    resolve(results);
                }
            }
        });
    });
}

function getEmployeeById(id){
    return new Promise(function (resolve, reject){
        connection.query({
            sql: 'SELECT * FROM `employees` WHERE `id` = ?',
            timeout: 40000,
            values: id
        }, function(error, results){
            if(error){
                return reject("Cannot get employee(s).");
            } else {
                if(results.length == 0){
                    return reject("Cannot find employee with that ID.");
                } else {
                    resolve(results);
                }
            }
        });
    });
}
exports.addAssignment = function(req, res, next){
    var post = {
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        effort: parseFloat(req.body.effort),
        employee_id: parseInt(req.body.employee_id),
        task_id: parseInt(req.body.task_id)
    }
    Promise.all([validateAssignment(post), getEmployeeById(post.employee_id), getTasksById(post.task_id)]).then(function(results){
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
                res.json(results);
            }
        });
    }).catch(function(error){
        res.json({
            error: error
        });
    });
};

exports.updateAssignment = function(req, res, next){
    // TODO: Input validation
    var put = {
        effort: req.body.effort,
    }
    connection.query({
        sql: 'UPDATE `assignments` SET ? WHERE `id` = ?',
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

exports.deleteAssignment = function(req, res, next){
    connection.query({
        sql: 'DELETE FROM `assignments` WHERE `id` = ? LIMIT 1',
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

exports.selectAssignmentByEmployeeTaskDate = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `assignments` WHERE `employee_id` = ? \
            AND `task_id` = ? AND `start_date` = ?',
        timeout: 40000,
        values: [req.query.employee_id, req.query.task_id, req.query.start_date]
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
const connection = require('../../db/index');

exports.selectAllTasks = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `tasks`',
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

exports.selectTaskById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `tasks` WHERE `id` = ?',
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

function getDeliverable(deliverableId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT deliverables.id from `deliverables` WHERE `id` = ?',
            timeout: 40000,
            values: deliverableId
        }, function(error, results){
            if(error){
                return reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function getDiscipline(disciplineId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT disciplines.id from `disciplines` WHERE `id` = ?',
            timeout: 40000,
            values: disciplineId
        }, function(error, results){
            if(error){
                return reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
exports.addTask = function(req, res, next){
    // TODO: Input validation
    var post = {
        title: req.body.title,
        description: req.body.description,
        committed: req.body.committed,
        discipline_id: req.body.discipline_id,
        deliverable_id: req.body.deliverable_id
    }
    //Checking if discipline and deliverable ids exist. 
    //If not discipline or deliverable, return JSON error
    //Else, insert into tasks and return new task object
    Promise.all([getDeliverable(post.deliverable_id), getDiscipline(post.discipline_id)]).then(function(results){
        connection.query({
            sql: 'INSERT INTO `tasks` SET ?',
            timeout: 40000,
            values: post 
        }, function(error, results){
            if(error){
                return res.json({
                    error: error
                });
            }
            //Query for newly added task and return new task 
            else{
                connection.query({
                    sql: 'SELECT tasks.id, tasks.title, tasks.description, tasks.committed, tasks.discipline_id, \
                        tasks.deliverable_id from `tasks` WHERE `id` = ? LIMIT 1',
                        timeout: 40000,
                        values: results.insertId
                }, function(error, results){
                    if(error){
                        return res.json({
                            error: error
                        });
                    } else{
                        res.json(results);
                    }
                });
            }
        });
    });
}

exports.updateTask = function(req, res, next){
    // TODO: Input validation
    var put = {
        title: req.body.title,
        description: req.body.description,
        committed: req.body.committed,
        discipline_id: req.body.discipline_id,
        deliverable_id: req.body.deliverable_id
    }
    connection.query({
        sql: 'UPDATE `tasks` SET ? WHERE `id` = ?',
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

exports.deleteTaskById = function(req, res, next){
    connection.query({
        // only delete task if there are no associate assignments
        // client should evaluate 'affectedRows' portion of JSON response
        sql: 'DELETE FROM `tasks` WHERE `id` = ? AND NOT EXISTS (SELECT * FROM `assignments` WHERE `task_id` = ?) LIMIT 1',
        timeout: 40000,
        values: [req.params.id, req.params.id]
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

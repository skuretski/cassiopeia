const connection = require('../../db/index');

exports.selectAllTasks = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `tasks`',
        timeout: 40000 //40seconds
    }, function(error, results){
        if(error){
            return res.status(500).json(error);
        }
        else{
            res.json(results);
        }
    });
};

exports.selectTaskById = function(req, res, next){
    if(!Number.isInteger(parseInt(req.params.id)) || req.params.id === ''){
        return res.status(400).json({
            status: 400,
            data: null,
            error: "Invalid task Id."
        });
    } else {
        connection.query({
            sql: 'SELECT * FROM `tasks` WHERE `id` = ?',
            timeout: 40000,
            values: req.params.id
        }, function(error, results){
            if(error){
                return res.status(500).json(error);
            }
            else{
                res.json(results);
            }
        });
    }
};

/*  Description: Helper function to find associated deliverables with task.
    Parameters: Deliverable ID
    Returns: Promise
        Reject: - cannot be found (error in database or results are zero)
        Resolve: any result >= 1
 */
function getDeliverable(deliverableId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT deliverables.id from `deliverables` WHERE `id` = ?',
            timeout: 40000,
            values: deliverableId
        }, function(error, results){
            if(error){
                return reject("Cannot find deliverable with that ID.");
            } else {
                if(results.length === 0){
                    return reject("Cannot find deliverable with that ID.");
                } else{
                    resolve(results);
                }
            }
        });
    });
}

/*  Description: Helper function to find associated assignments with task.
    Parameters: Task ID
    Returns Promise
        Reject: - error in database or results >= 1
        Resolve: zero results
 */
function getAssignmentsByTask(taskId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT * FROM `assignments` WHERE `task_id` = ?',
            timeout: 40000,
            values: taskId
        }, function(error, results){
            if(error){
                return reject("Cannot find assignment with that task ID.");
            } else{
                if(results.length >= 1){
                    return reject("Cannot delete task with associated assignments.");
                } else 
                    resolve(results);
            }
        });
    });
}

/*  Description: Helper function to find associated disciplines with task.
    Parameters: Discipline ID
    Returns Promise
        Reject: - error in database or result of zero
        Resolve: any result > 0
 */

function getDiscipline(disciplineId){
    return new Promise(function(resolve, reject){
        connection.query({
            sql: 'SELECT disciplines.id from `disciplines` WHERE `id` = ?',
            timeout: 40000,
            values: disciplineId
        }, function(error, results){
            if(error){
                return reject("Cannot find discipline with that ID.");
            } else {
                if(results.length === 0){
                    return reject("Cannot find discipline with that ID.");
                } else{
                    resolve(results);
                }

            }
        });
    });
}

/*  Description: helper function to validate parameters from a request
    Parameters: Task object {
        id (*not required for POST purposes with auto-increment ID),
        title, 
        description, 
        committed, 
        discipline_id, 
        deliverable_id
    }
    Returns Promise
        Reject: 
            - non-Integer values for discipline_id, deliverable_id, committed
            - NULL or empty all parameters
            - If task.id, non-Integer value, null and empty.
        Resolve
            - If any of those conditions are not met. 

 */
function validateTask(task){
    return new Promise(function(resolve, reject){
        var errors = {
            id: false,
            title: false,
            description: false,
            committed: false,
            discipline_id: false,
            deliverable_id: false
        };
        if(!Number.isInteger(task.deliverable_id) || task.deliverable_id == '' || task.deliverable_id == null){
            errors.deliverable_id = true;
            return reject("Must have a valid deliverable ID associated with this task.");
        }
        if(task.title == '' || task.title == null){
            errors.title = true;
        }
        if(task.description == '' || task.description == null){
            errors.description = true;
        }
        if(!Number.isInteger(task.committed) || task.committed === '' || task.committed == null){
            errors.committed = true;
        }
        if(!Number.isInteger(task.discipline_id) || task.discipline_id == '' || task.discipline_id == null){
            errors.discipline_id = true;
            return reject("Must have a valid discipline ID associated with this task.");
        }
        if(task.id){
            if(!Number.isInteger(task.id) || task.id == '' || task.id == null){
                errors.id = true;
            }
        }
        if(errors.title || errors.description || errors.committed || errors.discipline_id || errors.deliverable_id){
            return reject("Error with request parameters.");
        } else {
            resolve("No errors.");
        }
        
    });
}
exports.addTask = function(req, res, next){
    var post = {
        title: req.body.title,
        description: req.body.description,
        committed: parseInt(req.body.committed),
        discipline_id: parseInt(req.body.discipline_id),
        deliverable_id: parseInt(req.body.deliverable_id)
    }
    //Checking for valid parameters, and if discipline and deliverable IDs exist. 
    //If errors, return JSON error
    //Else, insert into tasks and return new task object
    Promise.all([validateTask(post),getDeliverable(post.deliverable_id), getDiscipline(post.discipline_id)]).then(function(results){
        connection.query({
            sql: 'INSERT INTO `tasks` SET ?',
            timeout: 40000,
            values: post 
        }, function(error, results){
            if(error){
                return res.status(500).json(error);
            }
            //Query for newly added task and return new task 
            else{
                connection.query({
                    sql: 'SELECT * from `tasks` WHERE `id` = ? LIMIT 1',
                        timeout: 40000,
                        values: results.insertId
                }, function(error, results){
                    if(error){
                        return res.status(500).json(error);
                    } else{
                        res.json(results);
                    }
                });
            }
        });
    }).catch(function(error){
        res.status(400).json({
            status: 400,
            data: null,   
            error: error
        });
    });
}

exports.updateTask = function(req, res, next){
    var put = {
        title: req.body.title,
        description: req.body.description,
        committed: parseInt(req.body.committed),
        discipline_id: parseInt(req.body.discipline_id),
        deliverable_id: parseInt(req.body.deliverable_id),
        id: parseInt(req.body.id)
    }
    // 1. Validates task parameters
    // 2. Checks if deliverable ID and discipline ID exist
    // 3. Then, updates in database. 
    // 4. Returns row change
    Promise.all([validateTask(put),getDeliverable(put.deliverable_id), getDiscipline(put.discipline_id)]).then(function(results){
        connection.query({
            sql: 'UPDATE `tasks` SET ? WHERE `id` = ?',
            timeout: 40000,
            values: [put, put.id]
        }, function(error, results){
            if(error){
                return res.status(500).json({
                    error: "Could not update task."
                });
            }
            else{
                res.json(results);
            }
        });
    // Catches Promise errors
    }).catch(function(error){
        res.status(400).json({
            status: 400,
            data: null,
            error: error
        });
    });
};

exports.deleteTaskById = function(req, res, next){
    const taskId = parseInt(req.params.id);
    //Validate Task ID
    if(!Number.isInteger(taskId) || taskId == null || taskId == ''){
        return res.status(400).json({
            status: 400,
            data: null,
            error: "Invalid task ID."
        });
    } else{
    //Find task with requested ID
        connection.query({
            sql: 'SELECT * FROM `tasks` WHERE `id` = ? LIMIT 1',
            timeout: 40000,
            values: taskId
        }, function(error, results){
            if(error){
                return res.status(500).json(error);
            } else{
                //If there is one result:
                //      Check if there are any assignments associated to task.
                //      If there is assignment with this task_id, then return error message.
                if(results.length === 1){
                    Promise.all([getAssignmentsByTask(results[0].id)]).then(function(results){
                        connection.query({
                            // only delete task if there are no associate assignments
                            // client should evaluate 'affectedRows' portion of JSON response
                            sql: 'DELETE FROM `tasks` WHERE `id` = ?',
                            timeout: 40000,
                            values: taskId
                        }, function(error, results){
                            if(error){
                                return res.status(500).json(error);
                            }
                            else{
                                res.json(results);
                            }
                        });
                    // Catch Promise errors
                    }).catch(function(error){
                        res.status(400).json({
                            status: 400,
                            data: null,
                            error: error
                        });
                    });
                }
            }             
        });
    }
}

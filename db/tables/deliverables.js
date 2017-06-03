const connection = require('../../db/index');
const assert = require('assert');

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
    if(!Number.isInteger(parseInt(req.params.id)) || req.params.id === ''){
        return res.json({
            error: "Invalid deliverable id."
        })
    } else{
        connection.query({
            sql: 'SELECT * FROM `deliverables` WHERE `id` = ?',
            timeout: 40000,
            values: req.params.id
        }, function(error, results){
            if(error){
                return res.json({
                    error: "Could not find that deliverable."
                });
            }
            else{
                res.json(results);
            }
        });
    }
};
function validateDeliverable(deliverable){
    //Error checking body parameters
    return new Promise(function(resolve, reject){
        var errors = {
            project_id: false,
            description: false,
            title: false,
            id: false
        };
        if(!Number.isInteger(deliverable.project_id) || deliverable.project_id === '' || deliverable.project_id === null){
            errors.project_id = true;
        } 
        if(deliverable.title === '' || deliverable.title == null){
            errors.title = true;
        }
        if(deliverable.description === '' || deliverable.description == null){
            errors.description = true;
        }
        if(deliverable.id){
            if(!Number.isInteger(deliverable.id))
                errors.id = true;
                connection.query({
                    sql:
                })
        }
        //Check if project exists
        connection.query({
            sql: 'SELECT projects.id from `projects` WHERE `id` = ? LIMIT 1',
            timeout: 40000,
            values: deliverable.project_id
        }, function(error, results){
            if(error){
                errors.project_id = true;
                return reject("Cannot find project with that ID.");
            } 
        });
        //If any errors exist, reject Promise
        if(errors.project_id || errors.description || errors.title ){
            return reject("Error with request parameters.");
        }
        //Else, resolve Promise  
        else
            resolve("No errors.");
    });
}
exports.addDeliverable = function(req, res, next){
    var post = {
        title: req.body.title,
        description: req.body.description,
        project_id: parseInt(req.body.project_id)   //Must change project_id to integer to check if integer in validation
    }
    //If no errors, connect to database and attempt to add 
    validateDeliverable(post).then(() => {
        connection.query({
            sql: 'INSERT INTO `deliverables` SET ?',
            timeout: 40000,
            values: post 
        }, function(error, results){
            //If error inserting into database, return JSON error
            if(error){
                return res.json(500,{
                    error: "Unable to insert deliverable"
                });
            }
            //Else, return newly created deliverable
            else{
                connection.query({
                    sql:'SELECT deliverables.id, deliverables.title, deliverables.description, deliverables.project_id \
                    from `deliverables` WHERE `id` = ?',
                    timeout: 40000,
                    values: results.insertId
                }, function(error, results){
                    if(error){
                        return res.json(500,{
                            error: "Error returning new deliverable."
                        });
                    } else {
                        res.json(results);
                    }
                });
            }
        });
    }).catch(function(error){
        res.json({
            error: "Error inserting deliverable."
        });
    });
};

exports.updateDeliverable = function(req, res, next){
    var put = {
        title: req.body.title,
        description: req.body.description,
        project_id: parseInt(req.body.project_id)
    }
    validateDeliverable(put).then(() => {
        connection.query({
            sql: 'UPDATE `deliverables` SET ? WHERE `id` = ?',
            timeout: 40000,
            values: [put, req.body.id]
        }, function(error, results){
            if(error){
                return res.json({
                    error: "Error updating deliverable."
                });
            }
            else{
                res.json(results);
            }
        });
    });
};

exports.deleteDeliverableById = function(req, res, next){
    connection.query({
        // Only delete deliverable if there are no associate tasks
        // client should evaluate 'affectedRows' portion of JSON response
        sql: 'DELETE FROM `deliverables` WHERE `id` = ? AND NOT EXISTS (SELECT * FROM `tasks` WHERE `deliverable_id` = ?) LIMIT 1',
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

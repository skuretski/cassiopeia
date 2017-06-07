const connection = require('../../db/index');

exports.selectAllProjects = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `projects`',
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

exports.selectProjectById = function(req, res, next){
    const id = parseInt(req.params.id);
    if(!Number.isInteger(id) || id == '' || id == null){
        return res.status(400).json({
            status: 400,
            data: null,
            error: "Invalid project ID."
        });
    } else{
        connection.query({
            sql: 'SELECT * FROM `projects` WHERE `id` = ?',
            timeout: 40000,
            values: id
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

function validateProject(project){
    return new Promise(function(resolve, reject){
        var errors = {
            title: false,
            description: false,
            id: false
        };
        if(project.title == '' || project.title == null){
            errors.title = true;
        }
        if(project.description == '' || project.description == null){
            errors.description = true;
        }
        if(project.id){
            if(!Number.isInteger(project.id))
                errors.id = true;
        }
        //If errors, reject Promise
        if(errors.title || errors.description || errors.id){
            return reject("Error with request parameters.");
        } else {
            resolve("No errors.");
        }
    });
}

exports.addProject = function(req, res, next){
    var post = {
        title: req.body.title,
        description: req.body.description
    }
    //Validate post parameters - if no errors, attempt to insert into database
    validateProject(post).then(() => {
        connection.query({
            sql: 'INSERT INTO `projects` SET ?',
            timeout: 40000,
            values: post 
        }, function(error, results){
            if(error){
                return res.status(500).json(error);
            }
            //Return newly created project
            else{
                connection.query({
                    sql:'SELECT projects.id, projects.title, projects.description from `projects` WHERE \
                    `id` = ?',
                    timeout: 40000,
                    values: results.insertId
                }, function(error, results){
                    if(error){
                        return res.statu(500).json(error);
                    } else {
                        res.json(results);
                    }
                });
            }
        })
    }).catch(function(error){
        res.status(400).json({
            status: 400,
            data: null,
            error: "Error inserting project. Invalid request parameters."
        });
    });
};

exports.updateProject = function(req, res, next){
    var put = {
        title: req.body.title,
        description: req.body.description,
        id: parseInt(req.body.id)
    }
    validateProject(put).then(() => {
        //Checking if project exists
        connection.query({
            sql: 'SELECT * FROM `projects` WHERE `id` = ? LIMIT 1',
            timeout: 40000,
            values: put.id
        }, function(error, results){
            if(error){
                return res.status(500).json(error);
            }
            //If project exists, update it.
            else{
                if(results.length >= 1){
                    connection.query({
                        sql: 'UPDATE `projects` SET ? WHERE `id` = ?',
                        timeout: 40000,
                        values: [put, put.id]
                    }, function(error, results){
                        if(error){
                            return res.status(500).json(error);
                        } else {
                            res.json(results);
                        }
                    });
                }
            }
        });
    }).catch(function(error){
        res.status(400).json({
            status: 400,
            data: null,
            error: error
        });
    });
};

exports.deleteProjectById = function(req, res, next){
    const projectId = parseInt(req.params.id);
    if(!Number.isInteger(projectId)){
        return res.status(400).json({
            status: 400,
            data: null,
            error: "Invalid project ID."
        });
    } else{
        connection.query({
            sql: 'SELECT * FROM `deliverables` WHERE `project_id` = ?',
            timeout: 40000,
            values: projectId
        }, function(error, results){
            //If there are deliverables with this project ID, return error.
            if(error){
                return res.status(500).json(error);
            } else{
                if(results.length >= 1){
                    return res.status(400).json({
                        status: 400,
                        data: null,
                        error: "Cannot delete project with associated deliverable(s)."
                    });
            //If there are no associated deliverables, send DELETE to database
                } else{
                    connection.query({
                        // only delete project if there are no associate deliverables
                        // client should evaluate 'affectedRows' portion of JSON response
                        sql: 'DELETE FROM `projects` WHERE `id` = ?',
                        timeout: 40000,
                        values: projectId
                    }, function(error, results){
                        if(error){
                            return res.status(500).json(error);
                        }
                        else{
                            res.json(results);
                        }
                    }); // --- DELETE connection.query
                } // --- else block
            } // --- else block
        }) // --- SELECT deliverable connection.query
    } // --- else block
};

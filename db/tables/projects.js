const connection = require('../../db/index');

exports.selectAllProjects = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `projects`',
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

exports.selectProjectById = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `projects` WHERE `id` = ?',
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

function validateProject(project){
    return new Promise(function(resolve, reject){
        var errors = {
            title: false,
            description: false,
            id: false
        };
        if(project.title === '' || project.title == null){
            errors.title = true;
        }
        if(project.description === '' || project.description == null){
            errors.description = true;
        }
        if(project.id){
            if(!Number.isInteger(project.id))
                errors.id = true;
            connection.query({
                sql: 'SELECT project.id from `projects` WHERE `id` = ? LIMIT 1',
                timeout: 20000,
                values: project.id
            }, function(error, results){
                if(error){
                    errors.id = true;
                    return reject("Cannot find project with that ID.");
                }
            });
        }
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
    validateProject(post).then(() => {
        connection.query({
            sql: 'INSERT INTO `projects` SET ?',
            timeout: 40000,
            values: post 
        }, function(error, results){
            if(error){
                return res.json({
                    error: "Error inserting project."
                });
            }
            else{
                connection.query({
                    sql:'SELECT projects.id, projects.title, projects.description from `projects` WHERE \
                    `id` = ?',
                    timeout: 40000,
                    values: results.insertId
                }, function(error, results){
                    if(error){
                        return res.json({
                            error: "Error retrieving new project."
                        });
                    } else {
                        res.json(results);
                    }
                });
            }
        }).catch(function(error){
            res.json({
                error: "Error inserting project."
            });
        });
    });
};

exports.updateProject = function(req, res, next){
    // TODO: Input validation
    var put = {
        title: req.body.title,
        description: req.body.description,
        id: parseInt(req.body.id)
    }
    connection.query({
        sql: 'UPDATE `projects` SET ? WHERE `id` = ?',
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

exports.deleteProjectById = function(req, res, next){
    connection.query({
        // only delete project if there are no associate deliverables
        // client should evaluate 'affectedRows' portion of JSON response
        sql: 'DELETE FROM `projects` WHERE `id` = ? AND NOT EXISTS (SELECT * FROM `deliverables` WHERE `project_id` = ?) LIMIT 1 ',
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

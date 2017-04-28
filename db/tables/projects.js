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

exports.addProject = function(req, res, next){
    // TODO: Input validation
    var post = {
        title: req.body.title,
        description: req.body.description
    }
    connection.query({
        sql: 'INSERT INTO `projects` SET ?',
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

exports.updateProject = function(req, res, next){
    // TODO: Input validation
    var put = {
        title: req.body.title,
        description: req.body.description,
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
    // TODO: ideally this would delete everything about the project
    // TODO: meaning deliverables, tasks, assignments, everything
    // TODO: or it would be disallowed if there were still associated rows
    // TODO: in other tables
    connection.query({
        sql: 'DELETE FROM `projects` WHERE `id` = ? LIMIT 1',
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

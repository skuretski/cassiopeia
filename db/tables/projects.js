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

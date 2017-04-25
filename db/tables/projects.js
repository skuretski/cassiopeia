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
            console.log(results);
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
            console.log(results);
            res.json(results);
        }
    });
};

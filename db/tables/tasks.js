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
            console.log(results);
            res.json(results);
        }
    });
};

exports.addTask = function(req, res, next){
    // TODO: Input validation
    var post = {
        title: req.body.title,
        description: req.body.description,
        committed: req.body.committed,
        discipline_id: req.body.discipline_id,
        deliverable_id: req.body.deliverable_id
    }
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
        else{
            console.log(results);
            res.json(results);
        }
    });
};

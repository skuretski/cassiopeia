const connection = require('../../db/index');

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
    connection.query({
        sql: 'SELECT * FROM `deliverables` WHERE `id` = ?',
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

exports.addDeliverable = function(req, res, next){
    // TODO: Input validation
    var post = {
        title: req.body.title,
        description: req.body.description,
        project_id: req.body.project_id
    }
    connection.query({
        // TODO: is there a way to make sure that the project_id actual exists in table 'project'?
        sql: 'INSERT INTO `deliverables` SET ?',
        timeout: 40000,
        values: post 
    }, function(error, results){
        if(error){
            return res.json({
                error: error
            });
        }
        else{
            connection.query({
                sql:'SELECT deliverables.id, deliverables.title, deliverables.description, deliverables.project_id \
                from `deliverables` WHERE `id` = ?',
                timeout: 40000,
                values: results.insertId
            }, function(error, results){
                if(error){
                    return res.json({
                        error: error
                    });
                } else {
                    res.json(results);
                }
            });
        }
    });
};

exports.updateDeliverable = function(req, res, next){
    // TODO: Input validation
    var put = {
        title: req.body.title,
        description: req.body.description,
        project_id: req.body.project_id
    }
    connection.query({
        sql: 'UPDATE `deliverables` SET ? WHERE `id` = ?',
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

exports.deleteDeliverableById = function(req, res, next){
    connection.query({
        // only delete deliverable if there are no associate tasks
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

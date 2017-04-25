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
            console.log(results);
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
            console.log(results);
            res.json(results);
        }
    });
};

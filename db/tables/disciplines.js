const connection = require('../../db/index');

exports.selectAllDisciplines = function(req, res, next){
    connection.query({
        sql: 'SELECT * FROM `disciplines`',
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

exports.selectDisciplineById = function(req, res, next){
    if(!Number.isInteger(parseInt(req.params.id)) || req.params.id === ''){
        return res.status(400).json({
            status: 400,
            data: null,
            error: 'Invalid discipline ID.'
        });
    } else{
        connection.query({
            sql: 'SELECT * FROM `disciplines` WHERE `id` = ?',
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

exports.addDiscipline = function(req, res, next){
    var post = {
        title: req.body.title,
        description: req.body.description
    }
    connection.query({
        sql: 'INSERT INTO `disciplines` SET ?',
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

exports.updateDiscipline = function(req, res, next){
    // TODO: Input validation
    var put = {
        title: req.body.title,
        description: req.body.description,
    }
    connection.query({
        sql: 'UPDATE `disciplines` SET ? WHERE `id` = ?',
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

exports.deleteDisciplineById = function(req, res, next){
    connection.query({
        // only delete project if there are no associate deliverables
        // client should evaluate 'affectedRows' portion of JSON response
        sql: 'DELETE FROM `disciplines` WHERE `id` = ? \
            AND NOT EXISTS (SELECT * FROM `employees` WHERE `discipline_id` = ?) \
            AND NOT EXISTS (SELECT * FROM `tasks` WHERE `discipline_id` = ?) LIMIT 1',
        timeout: 40000,
        values: Array(3).fill(req.params.id)
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

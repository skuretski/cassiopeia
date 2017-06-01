const connection = require('../../db/index');

exports.selectDeliverableView = function(req, res, next){

    function getProject() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT projects.id, projects.title FROM projects \
                    INNER JOIN deliverables ON projects.id = deliverables.project_id \
                    WHERE deliverables.id = ?;',
                timeout: 40000, //40seconds
                values: req.params.id
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getDeliverable() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM deliverables \
                    WHERE deliverables.id = ?;',
                timeout: 40000, //40seconds
                values: req.params.id
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };


    function getSow() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(man_mo) AS sum_man_mo, MONTH(start_date) AS mo, YEAR(start_date) as yr, task_id FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    WHERE deliverables.id = ? \
                    GROUP BY task_id, yr, mo ASC \
                    ORDER BY yr, mo, task_id ASC;',
                timeout: 40000, //40seconds
                values: req.params.id
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getAssignedEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(effort) as sum_effort, MONTH(start_date) as mo, YEAR(start_date) as yr, tasks.id as task_id FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    WHERE deliverables.id = ? \
                    GROUP BY task_id, yr, mo ASC \
                    ORDER BY yr, mo, task_id ASC;',
                timeout: 40000, //40seconds
                values: req.params.id
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    function getTitles() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT tasks.id as id, tasks.title as title FROM tasks \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    WHERE deliverables.id = ? \
                    GROUP BY id ASC ;',
                timeout: 40000, //40seconds
                values: req.params.id
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    function getDateRange() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    WHERE deliverables.id = ? \
                    UNION ALL \
                    SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM assignments \
		            INNER JOIN tasks ON assignments.task_id = tasks.id \
		            INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
		            WHERE deliverables.id = ? \
                    ORDER BY yr, mo ASC;',
                timeout: 40000, //40seconds
                values: [req.params.id, req.params.id]
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    Promise.all([getTitles(), getSow(), getAssignedEmployees(), getDateRange(), getDeliverable(), getProject()]).then(function(results) {
        payload = {};
        payload.tasks = results[0];
        payload.sow = results[1];
        payload.assigned_employees = results[2];
        payload.date_range = [];
        if (results[3].length > 0) {
            payload.date_range.push(results[3][0]);
            payload.date_range.push(results[3][results[3].length - 1]);
        }
        payload.deliverable = results[4];
        payload.project = results[5];
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });

};


exports.selectTasksByDeliverables = function(req, res, next){
    connection.query({
        sql: 'SELECT tasks.id, tasks.title, tasks.description, tasks.committed FROM tasks \
            INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
            INNER JOIN projects ON projects.id = deliverables.project_id \
            WHERE deliverables.id = ?;',
        timeout: 40000, //40seconds
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

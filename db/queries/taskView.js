const connection = require('../../db/index');

exports.selectTaskView = function(req, res, next){

    function getProject() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT projects.id, projects.title FROM projects \
                    INNER JOIN deliverables ON projects.id = deliverables.project_id \
                    INNER JOIN tasks ON deliverables.id = tasks.deliverable_id \
                    WHERE tasks.id = ?;',
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
                sql: 'SELECT deliverables.id, deliverables.title FROM deliverables \
                    INNER JOIN tasks on deliverables.id = tasks.deliverable_id \
                    WHERE tasks.id = ?;',
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

    function getTask() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM tasks \
                    WHERE tasks.id = ?;',
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
                sql: 'SELECT SUM(man_mo) AS sum_man_mo, MONTH(start_date) AS mo, YEAR(start_date) as yr FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    WHERE tasks.id = ? \
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
                sql: 'SELECT SUM(effort) as sum_effort, first, last, employees.id, \
                    MONTH(start_date) as mo, YEAR(start_date) as yr FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    WHERE tasks.id = ? \
                    GROUP BY yr, mo ASC \
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

    function getDateRange() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    WHERE tasks.id = ? \
                    UNION ALL \
                    SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM assignments \
		            INNER JOIN tasks ON assignments.task_id = tasks.id \
		            WHERE tasks.id = ? \
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


    Promise.all([getSow(), getAssignedEmployees(), getDateRange(), getTask(), getDeliverable(), getProject()]).then(function(results) {
        payload = {};
        payload.sow = results[0];
        payload.assigned_employees = results[1];
        payload.date_range = [];
        if (results[2].length > 0) {
            payload.date_range.push(results[2][0]);
            payload.date_range.push(results[2][results[2].length - 1]);
        }
        payload.task = results[3];
        payload.deliverable = results[4];
        payload.project = results[5];
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });
};

const connection = require('../../db/index');

exports.selectProjectView = function(req, res, next){

    function getSow() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(man_mo) AS sum_man_mo, MONTH(start_date) AS mo, YEAR(start_date) as yr, deliverable_id FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    WHERE projects.id = ? \
                    GROUP BY deliverable_id, yr, mo ASC \
                    ORDER BY yr, mo, deliverable_id ASC;',
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

    function getFunding() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(amount) as funding_amt, MONTH(start_date) AS mo, YEAR(start_date) as yr FROM funding \
                    INNER JOIN projects ON funding.project_id = projects.id \
                    WHERE projects.id = ? \
                    GROUP BY yr, mo ASC \
                    ORDER BY yr, mo ASC;',
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
                sql: 'SELECT SUM(effort) as sum_effort, MONTH(start_date) as mo, YEAR(start_date) as yr FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    WHERE projects.id = ? \
                    GROUP BY yr, mo ASC \
                    ORDER BY yr, mo ASC;',
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
                sql: 'SELECT deliverables.id as id, deliverables.title as title FROM deliverables \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    WHERE projects.id = ? \
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
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    WHERE projects.id = ? \
                    UNION ALL \
                    SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM funding \
                    INNER JOIN projects ON funding.project_id = projects.id \
		            WHERE projects.id = ? \
                    UNION ALL \
                    SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM assignments \
		            INNER JOIN tasks ON assignments.task_id = tasks.id \
		            INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
		            INNER JOIN projects ON deliverables.project_id = projects.id \
		            WHERE projects.id = ? \
                    ORDER BY yr, mo ASC;',
                timeout: 40000, //40seconds
                values: [req.params.id, req.params.id, req.params.id]
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    Promise.all([getTitles(), getSow(), getFunding(), getAssignedEmployees(), getDateRange()]).then(function(results) {
        payload = {};
        payload.titles = results[0];
        payload.sow = results[1];
        payload.funding = results[2];
        payload.assigned_employees = results[3];
        payload.date_range = [];
        if (results[4].length > 0) {
            payload.date_range.push(results[4][0]);
            payload.date_range.push(results[4][results[4].length - 1]);
        }
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });
};

exports.selectDeliverablesByProject = function(req, res, next){
    connection.query({
        sql: 'SELECT deliverables.id, deliverables.title, deliverables.description FROM deliverables \
            INNER JOIN projects ON deliverables.project_id = projects.id \
            WHERE projects.id = ?;',
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

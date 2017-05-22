const connection = require('../../db/index');

exports.selectFundingView = function(req, res, next){

    function getProject() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM projects;',
                timeout: 40000, //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };
    
    function getType() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM fundingTypes;',
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

    function getFundingByProject() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr, projects.id AS project_id, SUM(amount) as funding_amt FROM funding \
                    INNER JOIN projects ON funding.project_id = projects.id \
                    GROUP BY yr, mo, project_id ASC \
                    ORDER BY yr, mo, project_id ASC;',
                timeout: 40000, //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getFundingByType() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr, fundingTypes.id AS fundingType_id, SUM(amount) as funding_amt FROM funding \
                    INNER JOIN fundingTypes ON funding.type_id = fundingTypes.id \
                    GROUP BY yr, mo, fundingType_id ASC \
                    ORDER BY yr, mo, fundingType_id ASC;',
                timeout: 40000, //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

/**    
    function getAssignedEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(effort) as sum_effort, employees.id as employee_id, \
                    MONTH(start_date) as mo, YEAR(start_date) as yr FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    WHERE tasks.id = ? \
                    GROUP BY employee_id, yr, mo \
                    ORDER BY yr, mo, employee_id ASC;',
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

    function getEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT DISTINCT employees.id, first, last FROM employees \
                INNER JOIN assignments on employees.id = assignments.employee_id \
                INNER JOIN tasks ON assignments.task_id = tasks.id \
                WHERE tasks.id = ? \
                ORDER BY last ASC;',
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
**/

    function getDateRange() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM funding \
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

//    Promise.all([getEmployees(), getSow(), getAssignedEmployees(), getDateRange(), getTask(), getDeliverable(), getProject()]).then(function(results) {
    Promise.all([getProject(), getType(), getDateRange(), getFundingByProject(), getFundingByType()]).then(function(results) {
        payload = {};
        payload.project = results[0];
        payload.type = results[1];
        payload.date_range = [];
        if (results[2].length > 0) {
            payload.date_range.push(results[2][0]);
            payload.date_range.push(results[2][results[2].length - 1]);
        }
        payload.by_project = results[3];
        payload.by_type = results[4];
/**
        payload.employees = results[0];
        payload.sow = results[1];
        payload.assigned_employees = results[2];
        payload.date_range = [];
        if (results[3].length > 0) {
            payload.date_range.push(results[3][0]);
            payload.date_range.push(results[3][results[3].length - 1]);
        }
        payload.task = results[4];
        payload.deliverable = results[5];
        payload.project = results[6];
**/
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });
};

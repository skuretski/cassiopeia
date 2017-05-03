const connection = require('../../db/index');

exports.selectTaskView = function(req, res, next){

    function getSow() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(man_mo) AS sum_man_mo, MONTH(start_date) AS mo, YEAR(start_date) as yr FROM sow \
                    INNER JOIN tasks ON sow.task_id = tasks.id \
                    WHERE tasks.id = ? \
                    GROUP BY task_id, yr, mo ASC;',
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
                sql: 'SELECT first, last, MONTH(start_date) as mo, YEAR(start_date) as yr, SUM(effort) FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    WHERE tasks.id = ? \
                    GROUP BY yr, mo ASC;',
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

    Promise.all([getSow(), getAssignedEmployees()]).then(function(results) {
        res.json(results);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });
};
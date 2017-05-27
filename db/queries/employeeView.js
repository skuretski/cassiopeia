const connection = require('../../db/index');

exports.selectEmployeeView = function(req, res, next){

    function getEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT employees.id as emp_id, first, last, disciplines.id as disc_id, active_start_date, active_end_date FROM employees \
                    INNER JOIN disciplines ON employees.discipline_id = disciplines.id \
                    ORDER BY emp_id',
                timeout: 40000 //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getTasks() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM tasks',
                timeout: 40000 //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getDeliverables() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM deliverables',
                timeout: 40000 //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getProjects() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT id, title FROM projects',
                timeout: 40000 //40seconds
            }, function(error, results) {
                if (error) {
                    return reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    };

    function getDisciplines() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT * FROM disciplines',
                timeout: 40000 //40seconds
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
                sql: 'SELECT SUM(assignments.effort) AS sum_effort, employees.id AS employee_id, \
                    MONTH(assignments.start_date) as mo, YEAR(assignments.start_date) as yr, \
                    tasks.id AS task_id, deliverables.id as deliverable_id, projects.id as project_id FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    GROUP BY employee_id, task_id, yr, mo \
                    ORDER BY employee_id, yr, mo, project_id, deliverable_id, task_id ASC;',
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

    Promise.all([getEmployees(), getDisciplines(), getAssignedEmployees(), getTasks(), getDeliverables(), getProjects()]).then(function(results) {
        var now = new Date();
        for (var i = 0; i < results[0].length; i++) {
            if (results[0][i].active_start_date <= now && now <= results[0][i].active_end_date) {
                results[0][i].active = 'Yes';
            }
            else {
                results[0][i].active = 'No';
            }
        }
        results[0].sort(function(a, b) {return b.active.localeCompare(a.active)}); // put active employees first
        payload = {};
        payload.employees = results[0];
        payload.disciplines = results[1];
        payload.assignments = results[2];
        payload.tasks = results[3];
        payload.deliverables = results[4];
        payload.projects = results[5];
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });

};
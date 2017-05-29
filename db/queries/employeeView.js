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

    function getAssignedEmployeesByTask() {
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
                    ORDER BY employee_id ASC, project_id ASC, deliverable_id ASC, task_id ASC, yr ASC, mo ASC;',
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

    function getAssignedEmployeesByDeliverable() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(assignments.effort) AS sum_effort, employees.id AS employee_id, \
                    MONTH(assignments.start_date) as mo, YEAR(assignments.start_date) as yr, \
                    deliverables.id as deliverable_id, projects.id as project_id FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    GROUP BY employee_id, deliverable_id, yr, mo \
                    ORDER BY employee_id ASC, project_id ASC, deliverable_id ASC, yr ASC, mo ASC;',
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

    function getAssignedEmployeesByProject() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(assignments.effort) AS sum_effort, employees.id AS employee_id, \
                    MONTH(assignments.start_date) as mo, YEAR(assignments.start_date) as yr, \
                    projects.id as project_id FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    GROUP BY employee_id, project_id, yr, mo \
                    ORDER BY employee_id ASC, project_id ASC, yr ASC, mo ASC;',
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

    function getAssignedEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT SUM(assignments.effort) AS sum_effort, employees.id AS employee_id, \
                    MONTH(assignments.start_date) as mo, YEAR(assignments.start_date) as yr FROM assignments \
                    INNER JOIN employees ON assignments.employee_id = employees.id \
                    INNER JOIN tasks ON assignments.task_id = tasks.id \
                    INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id \
                    INNER JOIN projects ON deliverables.project_id = projects.id \
                    GROUP BY employee_id, yr, mo \
                    ORDER BY employee_id ASC, yr ASC, mo ASC;',
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
                sql: 'SELECT MONTH(start_date) AS mo, YEAR(start_date) as yr FROM assignments \
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

    Promise.all([getEmployees(), getDisciplines(), getAssignedEmployeesByTask(), getTasks(), getDeliverables(), getProjects(), getDateRange(),
        getAssignedEmployeesByProject(), getAssignedEmployeesByDeliverable(), getAssignedEmployees()]).then(function(results) {
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
        payload.tasks = results[3];
        payload.deliverables = results[4];
        payload.projects = results[5];
        payload.date_range = [];
        if (results[6].length > 0) {
            payload.date_range.push(results[6][0]);
            payload.date_range.push(results[6][results[6].length - 1]);
        }
        payload.assignments = results[9];
        payload.assignmentsByProj = results[7];
        payload.assignmentsByDel = results[8];
        payload.assignmentsByTask = results[2];
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });

};
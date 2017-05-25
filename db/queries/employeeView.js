const connection = require('../../db/index');

exports.selectEmployeeView = function(req, res, next){

    function getEmployees() {
        return new Promise(function(resolve, reject) {
            connection.query({
                sql: 'SELECT employees.id, first, last, title AS discipline, active_start_date, active_end_date FROM employees \
                    INNER JOIN disciplines ON employees.discipline_id = disciplines.id',
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

    Promise.all([getEmployees(), getDisciplines()]).then(function(results) {
        payload = {};
        payload.employees = results[0];
        payload.disciplines = results[1];
        res.json(payload);
    }).catch(function(error) {
        res.json({
            error: error
        });
    });

};
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
        var now = new Date();
        for (var i = 0; i < results[0].length; i++) {
            if (results[0][i].active_start_date <= now && now <= results[0][i].active_end_date) {
                results[0][i].active = 'Yes';
            }
            else {
                results[0][i].active = 'No';
            }
        }
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
const router = require('express').Router();
const employees = require('../db/tables/employees');
const disc = require('../db/tables/disciplines');
/******************************************************/
/*TODO: Create queries and routes 
const assignments = require('../db/assignments');
const deliv = require('../db/deliverables');

const funding = require('../db/funding');
const projects = require('../db/projects');
const tasks = require('../db/tasks');
*/
router.route('/')
    .get(function(req, res, next){
        res.render('index');
    });
router.route('/employees')
    .get(employees.selectAllEmployees);
    //.post()
router.route('/employees/:id')
    .get(employees.selectEmployeeById);
router.route('/disciplines')
    .get(disc.selectAllDisciplines);
router.route('/disciplines/:id')
    .get(disc.selectDisciplineById);
/*
router.route('/assignments/:id')
    .get()

router.route('/deliverables/:id')
    .get()



router.route('/funding')
    .get()

router.route('/projects/:id')
    .get()

router.route('/tasks/:id')
    .get()
*/
module.exports = router;
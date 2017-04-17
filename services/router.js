const router = require('express').Router();
const employees = require('../db/tables/employees');

/******************************************************/
/*TODO: Create queries and routes 
const assignments = require('../db/assignments');
const deliv = require('../db/deliverables');
const disc = require('../db/disciplines');
const funding = require('../db/funding');
const projects = require('../db/projects');
const tasks = require('../db/tasks');
*/
router.route('/employees')
    .get(employees.selectAllEmployees);
    //.post()
router.route('/employees/:id')
    .get(employees.selectEmployeeById);
/*
router.route('/assignments/:id')
    .get()

router.route('/deliverables/:id')
    .get()

router.route('/disciplines/:id')
    .get()

router.route('/funding')
    .get()

router.route('/projects/:id')
    .get()

router.route('/tasks/:id')
    .get()
*/
module.exports = router;
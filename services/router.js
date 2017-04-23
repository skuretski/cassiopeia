const router = require('express').Router();
const employees = require('../db/tables/employees');
const disc = require('../db/tables/disciplines');
const assignments = require('../db/tables/assignments');
const deliverables = require('../db/tables/deliverables');
const funding = require('../db/tables/funding');
const projects = require('../db/tables/projects');
const tasks = require('../db/tables/tasks');
const sow = require('../db/tables/sow');
/******************************************************/

router.route('/')
    .get(function(req, res, next){
        res.render('index');
    });

router.route('/employees')
    .get(employees.selectAllEmployees)
    .post(employees.addEmployee);
router.route('/employees/:id')
    .get(employees.selectEmployeeById);

router.route('/disciplines')
    .get(disc.selectAllDisciplines)
    .post(disc.addDiscipline);
router.route('/disciplines/:id')
    .get(disc.selectDisciplineById);

router.route('/assignments')
    .get(assignments.selectAllAssignments)
    // TODO: .post()
router.route('/assignments/:id')
    .get(assignments.selectAssignmentById);

router.route('/deliverables')
    .get(deliverables.selectAllDeliverables);
    // TODO: .post()
router.route('/deliverables/:id')
    .get(deliverables.selectDeliverableById);

router.route('/funding')
    .get(funding.selectAllFunding);
    // TODO: .post()
router.route('/funding/:id')
    .get(funding.selectFundingById);

router.route('/projects')
    .get(projects.selectAllProjects);
    // TODO: .post()
router.route('/projects/:id')
    .get(projects.selectProjectById);

router.route('/tasks')
    .get(tasks.selectAllTasks);
    // TODO: .post()
router.route('/tasks/:id')
    .get(tasks.selectTaskById);

router.route('/sow')
    .get(sow.selectAllSow);
    // TODO: .post()
router.route('/sow/:id')
    .get(sow.selectSowById);

module.exports = router;
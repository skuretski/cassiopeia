const router = require('express').Router();
const employees = require('../db/tables/employees');
const disc = require('../db/tables/disciplines');
const assignments = require('../db/tables/assignments');
const deliverables = require('../db/tables/deliverables');
const funding = require('../db/tables/funding');
const projects = require('../db/tables/projects');
const tasks = require('../db/tables/tasks');
const sow = require('../db/tables/sow');

const indexView = require('../db/queries/indexView');
const projectView = require('../db/queries/projectView');
const deliverableView = require('../db/queries/deliverableView');
/******************************************************/

router.route('/')
    .get(function(req, res, next){
        res.render('index');
    });

router.route('/indexView')
    .get(indexView.selectIndexView);

router.route('/projectView/:id')
    .get(projectView.selectProjectView);

router.route('/deliverableView/:id')
    .get(deliverableView.selectDeliverableView);

//router.route('/taskView/:id')
//    .get(taskView.selectTaskView);

router.route('/employees')
    .get(employees.selectAllEmployees)
    .post(employees.addEmployee)
    .put(employees.updateEmployee);
router.route('/employees/:id')
    .get(employees.selectEmployeeById)
    .delete(employees.deleteEmployeeById);

router.route('/disciplines')
    .get(disc.selectAllDisciplines)
    .post(disc.addDiscipline);
router.route('/disciplines/:id')
    .get(disc.selectDisciplineById);

router.route('/assignments')
    .get(assignments.selectAllAssignments)
    .post(assignments.addAssignment);
router.route('/assignments/:id')
    .get(assignments.selectAssignmentById);

router.route('/deliverables')
    .get(deliverables.selectAllDeliverables)
    .post(deliverables.addDeliverable)
    .put(deliverables.updateDeliverable);
router.route('/deliverables/:id')
    .get(deliverables.selectDeliverableById)
    .delete(deliverables.deleteDeliverableById);

router.route('/funding')
    .get(funding.selectAllFunding)
    .post(funding.addFunding);
router.route('/funding/:id')
    .get(funding.selectFundingById);

router.route('/projects')
    .get(projects.selectAllProjects)
    .post(projects.addProject)
    .put(projects.updateProject);
router.route('/projects/:id')
    .get(projects.selectProjectById)
    .delete(projects.deleteProjectById);

router.route('/tasks')
    .get(tasks.selectAllTasks)
    .post(tasks.addTask)
    .put(tasks.updateTask);
router.route('/tasks/:id')
    .get(tasks.selectTaskById)
    .delete(tasks.deleteTaskById);

router.route('/sow')
    .get(sow.selectAllSow)
    .post(sow.addSow); 
router.route('/sow/:id')
    .get(sow.selectSowById);

module.exports = router;

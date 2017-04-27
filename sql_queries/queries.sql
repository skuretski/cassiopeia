--Cummulative SOW by project ID, per month.
SELECT SUM(man_mo), MONTH(start_date) AS mo, YEAR(start_date) as yr, project_id FROM sow
INNER JOIN tasks ON sow.task_id = tasks.id
INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id
INNER JOIN projects ON deliverables.project_id = projects.id
GROUP BY yr, mo, project_id ASC;

--Provided funding (inner join ensures these have been associated with projects)
SELECT SUM(amount), MONTH(start_date) AS mo, YEAR(start_date) as yr FROM funding
INNER JOIN projects ON funding.project_id = project.id
GROUP BY yr, mo ASC;

--Assigned employees (inner joins ensures these have been assigned to employees and projects)
SELECT MONTH(start_date) as mo, YEAR(start_date) as yr, SUM(effort) FROM assignments
INNER JOIN employees ON assignments.employee_id = employees.id
INNER JOIN tasks ON assignments.task_id = tasks.id
INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id
INNER JOIN projects ON deliverables.project_id = projects.id
GROUP BY yr, mo ASC;

/*Totals for table below sandchart. This currently returns 0 results, I believe
 * because assignments is empty. */
SELECT SUM(sow.man_mo), SUM(funding.amount), SUM(assignments.effort), projects.id from sow
INNER JOIN tasks ON sow.task_id = tasks.id
INNER JOIN assignments ON tasks.id = assignments.task_id
INNER JOIN employees ON assignments.employee_id = employees.id
INNER JOIN deliverables ON tasks.deliverable_id = deliverables.id
INNER JOIN projects ON deliverables.project_id = projects.id
INNER JOIN funding ON projects.id = funding.project_id
GROUP BY projects.id ASC

//Required modules
const inquirer = require("inquirer");

//connect to the database
const db = require("./config/connection");

//aesthetic packages
const consoleTable = require("console.table");
const figlet = require("figlet");

//require dotenv package to keep database access credentials secure
require('dotenv').config();


//inquirer prompt questions
const askQuestions = async () => {

    await inquirer
        .prompt([
            {
                type: "list",
                name: "chooseOption",
                message: "What would you like to do?\n",
                choices: ["View all deaprtments.",
                    "View all roles.",
                    "View all employees.",
                    "View employees by manager.",
                    "View employees by department.",
                    "Add a department.",
                    "Add a role.",
                    "Add an employee.",
                    "Update an employee's role.",
                    "Delete an employee.",
                    "Quit."],
            }])

        .then((answer) => {
            switch (answer.chooseOption) {
                case "View all deaprtments.":
                    //function/query view departments.
                    viewAllDepartments();
                    break;

                case "View all roles.":
                    //function/query to view roles.
                    viewAllRoles();
                    break;

                case "View all employees.":
                    //function/query to view employees.
                    viewAllEmployees();
                    break;

                case "View employees by manager.":
                    //function/query to view employees.
                    viewEmployeesManagerQ();
                    break;

                case "View employees by department.":
                    //function/query to view employees.
                    viewEmployeesByDeptQ();
                    break;

                case "Add a department.":
                    //function to start the add department prompts
                    addDepartmentQ();
                    break;

                case "Add a role.":
                    //function to start the add role prompts
                    addRoleQ();
                    break;

                case "Add an employee.":
                    //function to start the add employee prompts
                    addEmployeeQ();
                    break;

                case "Update an employee's role.":
                    //function to start the add department prompts
                    updateRoleQ();
                    break;

                case "Delete an employee.":
                    deleteEmployeesQ();
                    break;

                //function to quit program
                default: quitProgram();
            }
        })
        //error handling
        .catch((error) => console.error(error))
};

//INQUIRER PROMPTS/QUESTIONS FOR EACH CATEGORY

const viewEmployeesManagerQ = () => {

    //variables for the queries required to generate choices arrays
    const selectManagersQuery = (`
        SELECT id,
        CONCAT (first_name, " ", last_name) AS manager_name 
        FROM employee
        WHERE manager_id IS NULL;
        `);

    //database query to obtain manager names for inquirer choices
    db.promise().query(selectManagersQuery)
        .then(([employeeName]) => {

            let employeeNameList = employeeName;
            //create new mapped array to use for the inquirer choices
            const nameChoices = employeeNameList.map(({ manager_name, id }) => ({
                name: manager_name,
                value: id,
            }))

            //This is to check that the values were pulling through correctly
            // console.log(nameChoices);

            inquirer.prompt([
                {
                    type: "list",
                    name: "chooseEmployee",
                    message: `Which manager's employees do you want to view?`,
                    choices: nameChoices,
                }
            ])

                .then((viewByManagerAnswer) => {

                    //function to run viewEmployeesManager database query
                    viewEmployeesManager(viewByManagerAnswer);
                })
                .catch((error) => console.error(error))
        })
};

const viewEmployeesByDeptQ = () => {

    //variables for the queries required to generate choices arrays
    const selectDeptQuery = (`
    SELECT name AS department_name, id FROM department;
    `)

    //database query to obtain department names for inquirer choices
    db.promise().query(selectDeptQuery)
        .then(([departmentName]) => {

            let departmentList = departmentName;
            //create new mapped array to use for the inquirer choices
            const deptChoices = departmentList.map(({ department_name, id }) => ({
                name: department_name,
                value: id,
            }))

            //This is to check that the values were pulling through correctly
            // console.log(deptChoices);

            inquirer.prompt([
                {
                    type: "list",
                    name: "chooseDepartment",
                    message: `Which department's employees do you want to view?`,
                    choices: deptChoices,
                }
            ])

                .then((viewDeptEmployeesAnswer) => {

                    //function to run viewEmployeesDept database query
                    viewEmployeesDept(viewDeptEmployeesAnswer);
                })
                .catch((error) => console.error(error))
        })
};

//add department inquirer prompts
const addDepartmentQ = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the Department Name?",
                validate: (deptQAnswer) => {
                    if (!deptQAnswer) {
                        return (`\x1b[38;5;126mPlease enter the department name.\x1b[0m`)
                    }
                    return true;
                }
            }])

        .then((deptQAnswer) => {
            //function to run the addDepartment query
            addDepartment(deptQAnswer);
        })
        //error handling
        .catch((error) => console.error(error))
};

//add role inquirer prompts
const addRoleQ = () => {

    //variables for the queries required to generate choices arrays
    const addRoleQuery = (`
        SELECT * FROM department
        `);

    //database query to create the array of department choices for the inquirer prompt
    db.promise().query(addRoleQuery)
        .then(([rows]) => {

            let departments = rows;
            //create new mapped array to use for the inquirer choices
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            //checking to see if the variable was populated correctly
            // console.log(departmentChoices)

            inquirer.prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?",
                    validate: (roleQAnswer) => {
                        if (!roleQAnswer) {
                            return (`\x1b[38;5;126mPlease enter the role name.\x1b[0m`)
                        }
                        return true;
                    }
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the salary for this role?",
                    validate: (roleQAnswer) => {
                        if (!roleQAnswer) {
                            return (`\x1b[38;5;126mPlease enter the salary.\x1b[0m`)
                        }
                        return true;
                    }
                },
                {
                    type: "list",
                    name: "chooseDepts",
                    message: "Which department does this role belong to?",
                    choices: departmentChoices,
                }])

                .then((roleQAnswer) => {

                    //function to run addRole database query
                    addRole(roleQAnswer);
                })
                //error handling
                .catch((error) => console.error(error))
        })
};

//add employee inquirer prompts
const addEmployeeQ = () => {

    //variables for the queries required to generate choices arrays
    const addEmployeeQuery = (`
        SELECT title, id AS role_id
        FROM role;
    `);
    const getManagersQuery = (`SELECT * FROM employee WHERE manager_id IS NULL;`);

    //database query to create the array of role choices for the inquirer prompt
    db.promise().query(addEmployeeQuery)
        .then(([role]) => {

            let roleTitles = role;

            //create new mapped array to use for the inquirer choices
            const roleChoices = roleTitles.map(({ title, role_id }) => ({
                name: title,
                value: role_id,
            }))
            //This is to check that the values were pulling through correctly
            // console.log(roleChoices);

            //database query to create the array of manager choices for the inquirer prompt
            db.promise().query(getManagersQuery)
                .then(([manager]) => {

                    let managerName = manager;

                    //create new mapped array to use for the inquirer choices
                    const managerChoices = managerName.map(({ first_name, id }) => ({
                        name: first_name,
                        value: id,
                    }))
                    //add a "none" option to the managerChoices array
                    managerChoices.push({ name: "None", value: null });

                    //This is to check that the values were pulling through correctly
                    // console.log(manager);

                    inquirer.prompt([
                        {
                            type: "input",
                            name: "employeeFirstName",
                            message: "What is the first name of the employee?",
                            validate: (employeeQAnswer) => {
                                if (!employeeQAnswer) {
                                    return (`\x1b[38;5;126mPlease enter the employee's first name.\x1b[0m`)
                                }
                                return true;
                            }
                        },
                        {
                            type: "input",
                            name: "employeeLastName",
                            message: "What is the last name of the employee?",
                            validate: (employeeQAnswer) => {
                                if (!employeeQAnswer) {
                                    return (`\x1b[38;5;126mPlease enter the employee's last name.\x1b[0m`)
                                }
                                return true;
                            }
                        },
                        {
                            type: "list",
                            name: "chooseRole",
                            message: `What is their role?`,
                            choices: roleChoices,
                        },
                        {
                            type: "list",
                            name: "chooseManager",
                            message: "Who is the employee's manager?",
                            choices: managerChoices,
                        }])

                        .then((employeeQAnswer) => {

                            //function to run addEmployee database query
                            addEmployee(employeeQAnswer);
                        })
                        //error handling
                        .catch((error) => console.error(error))
                })
        })
};

//update role inquirer prompt
const updateRoleQ = () => {

    //variables for the queries required to generate choices arrays
    const updateRoleChoicesQuery = (`
    SELECT id,
    CONCAT (first_name, " ", last_name) AS name 
    FROM employee;
    `);

    const selectAllRolesQuery = (
        `SELECT * FROM role;
        `);

    //database query to obtain employee names for inquirer choices
    db.promise().query(updateRoleChoicesQuery)
        .then(([employeeName]) => {
            let employeeNameList = employeeName;

            //create new mapped array to use for the inquirer choices
            const nameChoices = employeeNameList.map(({ name, id }) => ({
                name: name,
                value: id,
            }))
            //This is to check that the values were pulling through correctly
            // console.log(nameChoices);

            db.promise().query(selectAllRolesQuery)
                .then(([role]) => {

                    let roleIds = role;
                    //create new mapped array to use for the inquirer choices
                    const updatedRoleChoices = roleIds.map(({ title, id }) => ({
                        name: title,
                        value: id,
                    }))
                    //This is to check that the values were pulling through correctly
                    // console.log(updatedRoleChoices);

                    inquirer.prompt([

                        {
                            type: "list",
                            name: "chooseEmployee",
                            message: `Which employee's role do you want to update?`,
                            choices: nameChoices,
                        },
                        {
                            type: "list",
                            name: "updateRole",
                            message: "What is their new role?",
                            choices: updatedRoleChoices,
                        }])

                        .then((updateRoleAnswer) => {

                            //function to run updateEmployeeRole database query
                            updateEmployeeRole(updateRoleAnswer);
                        })
                        .catch((error) => console.error(error))
                })
        })
};

//delete employee inquirer prompts
const deleteEmployeesQ = () => {

    //variables for the queries required to generate choices arrays
    const deleteEmployeesQuery = (`
        SELECT id,
        CONCAT (first_name, " ", last_name) AS employee_name 
        FROM employee;
        `);

    //database query to obtain employee names for inquirer choices
    db.promise().query(deleteEmployeesQuery)
        .then(([employeeName]) => {

            let employeeNameList = employeeName;
            //create new mapped array to use for the inquirer choices
            const nameChoices = employeeNameList.map(({ employee_name, id }) => ({
                name: employee_name,
                value: id,
            }))

            //This is to check that the values were pulling through correctly
            // console.log(nameChoices);

            inquirer.prompt([
                {
                    type: "list",
                    name: "chooseEmployee",
                    message: `Which employee do you want to delete?`,
                    choices: nameChoices,
                }
            ])

                .then((deleteEmployeesAnswer) => {

                    //function to run deleteEmployee database query
                    deleteEmployees(deleteEmployeesAnswer);
                })
                .catch((error) => console.error(error))
        })
};

//database query to view all departments
function viewAllDepartments() {

    const viewAllDepartmentsQuery = (`
        SELECT * FROM department;
        `)

    db.query(viewAllDepartmentsQuery, ((err, results) => {

        console.log(results);
        err ? console.err("Oops! No departments to view.") : console.table(`\n`, results, `\n`)

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })
    )
};

//database query to view all roles
function viewAllRoles() {

    const viewAllRolesQuery = (`
    SELECT * FROM role;
    `)

    db.query(viewAllRolesQuery, ((err, results) => {

        err ? console.err("Oops! No departments to view.") : console.table(`\n`, results, `\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to view all employees
function viewAllEmployees() {

    const viewEmployeesQuery = `
        SELECT e.id AS employee_id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS Manager
        FROM employee e
        JOIN role ON e.role_id = role.id
        JOIN department ON department.id = role.department_id
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id ASC;
    `
    db.query(viewEmployeesQuery, ((err, results) => {

        err ? console.err("Oops! No employees to view.") : console.table(`\n`, `\x1b[1;4;38;5;133mView All Employees\x1b[0m`, `\n`, results, `\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to view employees by manager
function viewEmployeesManager(viewByManagerAnswer) {

    const selectAllEmployeesQuery = (
        `SELECT * FROM employee
        WHERE manager_id = ?;
        `);
    const params = [viewByManagerAnswer.chooseEmployee];

    db.query(selectAllEmployeesQuery, params, ((err, results) => {

        err ? console.err("Oops! No managers to view.") : console.table(`\n`, `\x1b[1;4;38;5;133mView All Employees by Manager\x1b[0m`, `\n`, results, `\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to view employees by department
function viewEmployeesDept(viewDeptEmployeesAnswer) {

    const selectAllDeptQuery = (`
        SELECT e.first_name, e.last_name, role.title, department.name AS department
        FROM employee e
        JOIN role ON e.role_id = role.id
        JOIN department ON department.id = role.department_id
        WHERE role.department_id = ?
        ORDER BY e.id ASC;
        `);

    const params = [viewDeptEmployeesAnswer.chooseDepartment];

    db.query(selectAllDeptQuery, params, ((err, results) => {

        err ? console.err("Oops! No employees to view.") : console.table(`\n`, `\x1b[1;4;38;5;133mView All Employees by Department - ${results[0].department}\x1b[0m`, `\n`, results, `\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to add department
function addDepartment(deptQAnswer) {

    const addDeptQuery = `
        INSERT INTO department(name)
    VALUES(?)`;
    const deptParams = deptQAnswer.departmentName;

    db.query(addDeptQuery, deptParams, ((err, results) => {

        err ? console.err(err) : console.log(`\n Success! ${deptQAnswer.departmentName} added to the database.\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to add roles
function addRole(roleQAnswer) {

    const roleQuery = `
        INSERT INTO role(title, salary, department_id)
    VALUES(?, ? , ?); `;
    const roleParams = [roleQAnswer.roleName, roleQAnswer.roleSalary, roleQAnswer.chooseDepts]

    db.query(roleQuery, roleParams, ((err, results) => {

        err ? console.err(err) : console.log(`\n Success! ${roleQAnswer.roleName} added to database.\n ${results.info} \n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to add employee
function addEmployee(employeeQAnswer) {

    const employeeQuery = `
        INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES(?, ? , ?, ?); `;
    const employeeParams = [employeeQAnswer.employeeFirstName, employeeQAnswer.employeeLastName, employeeQAnswer.chooseRole, employeeQAnswer.chooseManager];

    db.query(employeeQuery, employeeParams, ((err, results) => {

        err ? console.err(err) : console.log(`\n Success! ${employeeQAnswer.employeeFirstName} ${employeeQAnswer.employeeLastName} added to database.\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//database query to update employee role
function updateEmployeeRole(updateRoleAnswer) {

    const updateRoleQuery = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?;
    `;
    const updateRoleParams = [updateRoleAnswer.updateRole, updateRoleAnswer.chooseEmployee];

    db.query(updateRoleQuery, updateRoleParams, ((err, results) => {

        err ? console.err(err) : console.table(`\n Success!\n ${results.info} \n`);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))

};

function deleteEmployees(deleteEmployeesAnswer) {

    const deleteEmployeeQuery = (
        `DELETE FROM employee
        WHERE employee.id = ?;
        `);
    const params = [deleteEmployeesAnswer.chooseEmployee];

    db.query(deleteEmployeeQuery, params, ((err, results) => {

        err ? console.err("Oops! No employees to delete.") : console.log(`\n`, `\x1b[1;4;38;5;133mEmployee Deleted\x1b[0m`, `\n`);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    }))
};

//function to quit program
function quitProgram() {
    console.log(`\n`, `\x1b[1;38;5;74mThank you for using the EMS!\x1b[0m`, `\n`);
    //close database connection
    db.end();
    //exit application
    process.exit(0);
}

//function to initiate the inquirer prompts
const showQuestions = () => {
    return init();
}

//function to set up init
const init = () => {
    askQuestions();
}

//BEGIN!! Figlet npm to make a pretty title.
figlet.text("EMS", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`\x1b[1;38;5;74m${data} \nWelcome to the Employee Management System\x1b[0m \n`);
    // console.log(`\x1b[38; 5; 256mWelcome to the Employee Management System\x1b[0m`)

    //inquirer prompt to start app or quit
    inquirer.prompt([
        {
            type: "list",
            name: "startApp",
            message: "Would you like to start the EMS (Employee Management System?",
            choices: ["Yes", "No"],
        }
    ])
        .then((answer) => {
            switch (answer.startApp) {
                case "Yes":
                    //function/query view departments.
                    askQuestions();
                    break;

                default: quitProgram();
            }
        })
});


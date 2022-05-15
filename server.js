//Required modules

const inquirer = require("inquirer");
// const {
//     viewAllDepartments,
//     viewAllRoles,
//     viewAllEmployees,
//     addDepartment,
//     addRole,
//     addEmployee,
// } = require("./src/helpers/queries");
// const util = require('util');

const db = require("./config/connection");
// const mysql = require("mysql2");
// const { title } = require("process");

// const consoleTable = require("console.table");


// const { addDepartmentQ } = require("./src/helpers/inquirer")
//dont need to require - just use like you would a console.log


//require dotenv package to keep sql access credentials secure
require('dotenv').config();

// let allDepts = [];
// let allDeptsNames = allDepts.name;

const askQuestions = async () => {
    // function askQuestions() {

    await inquirer
        .prompt([
            {
                type: "list",
                name: "chooseOption",
                message: "What would you like to do?",
                choices: ["View all deaprtments.",
                    "View all roles.",
                    "View all employees.",
                    "Add a department.",
                    "Add a role.",
                    "Add an employee.",
                    // "Update an employee's role.",
                    "Quit."],
            }])
        //switch case?
        .then((answer) => {
            switch (answer.chooseOption) {
                case "View all deaprtments.":
                    //function to view departments - query to view departments.
                    viewAllDepartments();
                    // askQuestions;
                    break;

                case "View all roles.":
                    viewAllRoles();
                    // askQuestions();
                    break;

                case "View all employees.":
                    viewAllEmployees();
                    break;

                case "Add a department.":
                    addDepartmentQ();
                    break;

                case "Add a role.":
                    addRoleQ();
                    break;

                case "Add an employee.":
                    addEmployeeQ();
                    break;
                default: console.log("Default")
            }

        })
        .catch((error) => console.error(error))
};

const addDepartmentQ = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "departmentName",
                message: "What is the Department Name?",
                validate: (deptQAnswer) => {
                    if (!deptQAnswer) {
                        return ("Please enter the department name.")
                    }
                    return true;
                }

            }])
        //switch case?
        .then((deptQAnswer) => {
            // departmentsArray.push(deptQAnswer);
            addDepartment(deptQAnswer);
        })
        .catch((error) => console.error(error))
};

const addRoleQ = () => {

    db.promise().query(`SELECT * FROM department`)
        .then(([rows]) => {

            // console.log(results)

            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            // console.log(departmentChoices, "line 117")

            inquirer.prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role?",
                    validate: (roleQAnswer) => {
                        if (!roleQAnswer) {
                            return ("Please enter the role name.")
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
                            return ("Please enter the salary.")
                        }
                        return true;

                    }
                },
                {
                    type: "list",
                    name: "chooseDepts",
                    message: "Which department does this role belong to?",

                    //FIX THIS SO IT LISTS ALL DEPTS AND ISN'T JUST HARDCODED
                    choices: departmentChoices,
                }])
                //switch case?
                .then((roleQAnswer) => {
                    addRole(roleQAnswer);
                })
                .catch((error) => console.error(error))
        })
};

const addEmployeeQ = () => {

    db.promise().query(`SELECT title, department_id FROM role;`)
        .then(([role]) => {
            console.log(role);
            let roleTitles = role;

            const roleChoices = roleTitles.map(({ title, department_id }) => ({
                name: title,
                value: department_id,
            }))
            //This is to check that the values were pulling through correctly
            // console.log(roleChoices);

            db.promise().query(`SELECT * FROM employee WHERE manager_id IS NULL;`)
                .then(([manager]) => {

                    let managerName = manager;

                    const managerChoices = managerName.map(({ first_name, id }) => ({
                        name: first_name,
                        value: id,
                    }))
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
                                    return ("Please enter the employee's first name.")
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
                                    return ("Please enter the employee's last name.")
                                }
                                console.log(managerChoices);
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
                            //This is to check that the values were pulling through correctly
                            // console.log(employeeQAnswer);
                            addEmployee(employeeQAnswer);
                        })
                        .catch((error) => console.error(error))
                })
        })
};

function viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);

        showQuestions();
    }
    )
};

function viewAllRoles() {
    db.query("SELECT * FROM role", function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);

        showQuestions();
    }
    )
};

function viewAllEmployees() {

    //FIGURE OUT WHY THIS ISN'T PRINTING

    db.promise().query(
        `SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (m.first_name, " ", m.last_name) AS Manager
        FROM employee
        JOIN role ON employee.id = role.id
        JOIN department ON department.id = role.department_id
        LEFT JOIN employee m ON m.manager_id = employee.id;
        `), function (err, results) {
            console.log(results);
            //UNCOMMENT AFTER YOU'RE DONE TESTING
            // err ? console.err : console.table(`\n`, results, `\n`);
            err ? console.err : console.table(results);
        }
    showQuestions();
};

function addDepartment(deptQAnswer) {
    console.log(deptQAnswer);
    const sqlQuery = `
    INSERT INTO department (name)
    VALUES (?)`;
    const params = deptQAnswer.departmentName;
    db.promise().query(sqlQuery, params, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);

    })
    showQuestions();
};

function addRole(roleQAnswer) {
    console.log(roleQAnswer);
    const sqlQuery = `
    INSERT INTO role (title, salary, department_id)
    VALUES (?, ? , ?);`;
    const roleParams = [roleQAnswer.roleName, roleQAnswer.roleSalary, roleQAnswer.chooseDepts]
    // const params = [roleQAnswer.roleName, roleQAnswer.roleSalary, roleQAnswer.chooseDepts];
    // const params = [null, "Customer Service", 60000, null];
    console.log(roleParams);
    db.query(sqlQuery, roleParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        console.log(results);
        err ? console.err : console.table(results);

        showQuestions();
    }
    )
};

function addEmployee(employeeQAnswer) {
    console.log(employeeQAnswer);
    const sqlQuery = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ? , ?, ?);`;
    const employeeParams = [employeeQAnswer.employeeFirstName, employeeQAnswer.employeeLastName, employeeQAnswer.chooseRole, employeeQAnswer.chooseManager];
    //This is to check that the values were pulling through correctly
    // console.log(employeeParams);
    db.promise().query(sqlQuery, employeeParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        console.log(results)
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);
    })
    showQuestions();
};

// function updateEmployeeRole() {
//     db.query("UPDATE role FROM department", function (err, results) {
//         //UNCOMMENT AFTER YOU'RE DONE TESTING
//         // err ? console.err : console.table(`\n`, results, `\n`);
//         err ? console.err : console.table(results);

//         showQuestions();
//     }
//     )
// };

const showQuestions = () => {
    return init();
}

const init = () => {
    askQuestions();
}

init();

module.exports = {
    showQuestions,
}

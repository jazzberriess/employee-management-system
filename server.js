//Required modules
const inquirer = require("inquirer");

//connect to the database
const db = require("./config/connection");

//require dotenv package to keep database access credentials secure
require('dotenv').config();

//inquirer prompt questions
const askQuestions = async () => {

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
                    "Update an employee's role.",
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

                //function to quit program
                default: quitProgram();
            }

        })
        //error handling
        .catch((error) => console.error(error))
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

const addRoleQ = () => {

    //database query to create the array of department choices for the inquirer prompt
    db.promise().query(`SELECT * FROM department`)
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

    //database query to create the array of role choices for the inquirer prompt
    db.promise().query(`SELECT title, id AS role_id FROM role;`)
        .then(([role]) => {
            console.log(role);
            let roleTitles = role;

            //create new mapped array to use for the inquirer choices
            const roleChoices = roleTitles.map(({ title, role_id }) => ({
                name: title,
                value: role_id,
            }))
            //This is to check that the values were pulling through correctly
            // console.log(roleChoices);

            //database query to create the array of manager choices for the inquirer prompt
            db.promise().query(`SELECT * FROM employee WHERE manager_id IS NULL;`)
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

    //database query to obtain employee names for inquirer choices
    db.promise().query(`
    SELECT id,
    CONCAT (first_name, " ", last_name) AS name 
    FROM employee;`)
        .then(([employeeName]) => {
            let employeeNameList = employeeName;
            //create new mapped array to use for the inquirer choices
            const nameChoices = employeeNameList.map(({ name, id }) => ({
                name: name,
                value: id,
            }))
            //This is to check that the values were pulling through correctly
            // console.log(nameChoices);

            db.promise().query(`SELECT * FROM role;`)
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

//database query to view all departments
function viewAllDepartments() {

    db.query("SELECT * FROM department", function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);

        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })
};

//database query to view all roles
function viewAllRoles() {

    db.query("SELECT * FROM role", function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })
};

//database query to view all employees
function viewAllEmployees() {

    const viewEmployeesQuery = `SELECT e.id AS employee_id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT(m.first_name, " ", m.last_name) AS Manager
    FROM employee e
    JOIN role ON e.role_id = role.id
    JOIN department ON department.id = role.department_id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id ASC;
    `
    db.query(viewEmployeesQuery, function (err, results) {
        console.log(results);
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })

};

//database query to add department
function addDepartment(deptQAnswer) {

    const addDeptQuery = `
        INSERT INTO department (name)
        VALUES (?)`;
    const deptParams = deptQAnswer.departmentName;
    db.promise().query(addDeptQuery, deptParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);

    })
    //run the show questions inquirer prompts after db.query has resolved
    showQuestions();
};

//database query to add roles
function addRole(roleQAnswer) {

    const roleQuery = `
        INSERT INTO role (title, salary, department_id)
        VALUES (?, ? , ?);`;
    const roleParams = [roleQAnswer.roleName, roleQAnswer.roleSalary, roleQAnswer.chooseDepts]

    db.query(roleQuery, roleParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        console.log(results);
        err ? console.err : console.table(results);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })
};

//database query to add employee
function addEmployee(employeeQAnswer) {
    console.log(employeeQAnswer)
    const employeeQuery = `
        INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ? , ?, ?);`;
    const employeeParams = [employeeQAnswer.employeeFirstName, employeeQAnswer.employeeLastName, employeeQAnswer.chooseRole, employeeQAnswer.chooseManager];
    console.log(employeeParams);
    db.query(employeeQuery, employeeParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        console.log(results)
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })
};

//database query to update employee role
function updateEmployeeRole(updateRoleAnswer) {
    console.log(updateRoleAnswer)
    const updateRoleQuery = `
        UPDATE employee
        SET role_id = ?
        WHERE id = ?;
        `;
    const updateRoleParams = [updateRoleAnswer.updateRole, updateRoleAnswer.chooseEmployee];
    console.log(updateRoleParams);
    db.query(updateRoleQuery, updateRoleParams, function (err, results) {
        //UNCOMMENT AFTER YOU'RE DONE TESTING
        // err ? console.err : console.table(`\n`, results, `\n`);
        err ? console.err : console.table(results);
        //run the show questions inquirer prompts after db.query has resolved
        showQuestions();
    })

};

//function to quit program
function quitProgram() {
    console.log(`\n\x1b[38;5;133mThank you for using the EMS!\x1b[0m\n`);
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

//BEGIN!!
init();

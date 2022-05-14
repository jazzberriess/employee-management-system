// const db = require("../../config/connection");
// const init = require("../../server");
// const showQuestions = require("../../server");

// // let consoleTable = require("console.table");

// //database queries
// function viewAllDepartments() {
//     db.query("SELECT * FROM department", function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results)

//             //SOMEHOW FIGURE OUT HOW TO GET IT TO ASK QUESTIONS AGAIN
//             showQuestions();
//         }
//     });
//     // askQuestions();
// };

// function viewAllRoles() {
//     db.query("SELECT * FROM role", function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results)
//             showQuestions();
//         }
//     });
// };

// function viewAllEmployees() {
//     db.query("SELECT * FROM employee", function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results)
//             showQuestions();
//         }
//     });
// };

// function addDepartment(deptQAnswer) {
//     console.log(deptQAnswer);
//     const sqlQuery = `INSERT INTO department (name)
//     VALUES (?)`;
//     const params = deptQAnswer.departmentName;
//     db.query(sqlQuery, params, function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results);
//             // askQuestions();
//         }
//     });

//     askQuestions();
// };

// function addRole(roleQAnswer) {
//     console.log(roleQAnswer);
//     const sqlQuery = `INSERT INTO role (id, title, salary, department_id)
//     VALUES (?, ?, ? , ?)`;
//     const roleParams = [null, roleQAnswer.roleName, roleQAnswer.roleSalary, 4];
//     // const params = [roleQAnswer.roleName, roleQAnswer.roleSalary, roleQAnswer.chooseDepts];
//     // const params = [null, "Customer Service", 60000, null];
//     console.log(roleParams);
//     db.query(sqlQuery, roleParams, function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results);
//             showQuestions();
//         }
//     });
// };

// function addEmployee(employeeQAnswer) {
//     console.log(employeeQAnswer);
//     const sqlQuery = `INSERT INTO employee (id, first_name, last_name, role_id)
//     VALUES (?, ?, ?, ?)`;
//     const employeeParams = [null, employeeQAnswer.employeeFirstName, employeeQAnswer.employeeLastName, null];
//     console.log(employeeParams);
//     db.query(sqlQuery, employeeParams, function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.table(results);
//             showQuestions();
//         }
//     });
// };

// module.exports = {
//     viewAllDepartments,
//     viewAllRoles,
//     viewAllEmployees,
//     addDepartment,
//     addRole,
//     addEmployee,
// }
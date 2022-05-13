const db = require("../../config/connection");
const askQuestions = require("../../server");

// let consoleTable = require("console.table");

//database queries
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        if (err) {
            console.error(err)
        } else {
            console.table(results)
        }
    })
};

function viewAllRoles() {
    db.query("SELECT * FROM role", function (err, results) {
        if (err) {
            console.error(err)
        } else {
            console.table(results)
        }
    })
};

function viewAllEmployees() {
    db.query("SELECT * FROM employee", function (err, results) {
        if (err) {
            console.error(err)
        } else {
            console.table(results)
        }
    })
};

function addDepartment(deptQAnswer) {
    console.log(deptQAnswer);
    const sqlQuery = `INSERT INTO department (name)
    VALUES (?)`;
    const params = deptQAnswer.departmentName;
    db.query(sqlQuery, params, function (err, results) {
        if (err) {
            console.error(err)
        } else {
            console.table(results);
            // askQuestions();
        }
    })
};

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
}
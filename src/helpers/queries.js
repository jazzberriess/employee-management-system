const db = require("../../config/connection");

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

module.exports = {
    viewAllDepartments,
    viewAllRoles,
}
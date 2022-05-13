const inquirer = require("inquirer");
// const viewAllDepartments = require("../../../server");
// const viewAllDepartments = require(viewAllDepartments)
const { addDepartment } = require("./queries");

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
            addDepartment(deptQAnswer);
        })
        .catch((error) => console.error(error))
};

// function viewAllDepartments() {
//     db.query("SELECT * FROM departments", function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.log(results)
//         }
//     })
// };


module.exports = {
    addDepartmentQ,
}
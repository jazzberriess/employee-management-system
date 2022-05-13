//Required modules

const inquirer = require("inquirer");
const { viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
} = require("./src/helpers/queries")

const { addDepartmentQ } = require("./src/helpers/inquirer")
//dont need to require - just use like you would a console.log


//require dotenv package to keep sql access credentials secure
require('dotenv').config();

// const askQuestions = () => {
function askQuestions() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "chooseOption",
                message: "What would you like to do?",
                choices: ["View all deaprtments.",
                    "View all roles.",
                    "View all employees.",
                    "Add a department.",
                    // "Add a role.",
                    // "Add an employee.",
                    // "Update an employee.",
                    "Quit."],
            }])
        //switch case?
        .then((answer) => {
            switch (answer.chooseOption) {
                case "View all deaprtments.":
                    //function to view departments - query to view departments.
                    viewAllDepartments();
                    break;

                case "View all roles.":
                    viewAllRoles();
                    break;

                case "View all employees.":
                    viewAllEmployees();
                    break;

                case "Add a department.":
                    addDepartmentQ();
                    break;
                default: console.log("Default")
            }

        })
        .catch((error) => console.error(error))
};





askQuestions();

module.exports = askQuestions;

//Listening for the server
// app.listen(PORT, () => {
//     console.log(`We're live and running the server on port ${PORT}`)
// })
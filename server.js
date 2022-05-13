//Required modules

const inquirer = require("inquirer");
const { viewAllDepartments, viewAllRoles } = require("./src/helpers/queries")
//dont need to require - just use like you would a console.log


//require dotenv package to keep sql access credentials secure
require('dotenv').config();

const askQuestions = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "chooseOption",
                message: "What would you like to do?",
                choices: ["View all deaprtments.",
                    "View all roles.",
                    "View all employees.",
                    // "Add a department.",
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
                default: console.log("Default")
            }
            // if (answer.chooseOption === "View all deaprtments.") {
            //     console.log("Departments chosen")
            //     return managerInputs();
            // } else if (answer.chooseOption === ("View all roles.")) {
            //     console.log("Roles chosen")
            //     return engineerInputs();
            // } else if (answer.chooseOption === "Intern") {
            //     console.log("Intern chosen")
            //     return internInputs();
            // } else {

            //     writeToFile();
            // }
        })
        .catch((error) => console.error(error))
};





askQuestions();


//Listening for the server
// app.listen(PORT, () => {
//     console.log(`We're live and running the server on port ${PORT}`)
// })
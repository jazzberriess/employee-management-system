// const inquirer = require("inquirer");
// // const viewAllDepartments = require("../../../server");
// // const viewAllDepartments = require(viewAllDepartments)

// const askQuestions = () => {
//     inquirer
//         .prompt([
//             {
//                 type: "list",
//                 name: "chooseOption",
//                 message: "What would you like to do?",
//                 choices: ["View all deaprtments.",
//                     "View all roles.",
//                     "View all employees.",
//                     // "Add a department.",
//                     // "Add a role.",
//                     // "Add an employee.",
//                     // "Update an employee.",
//                     "Quit."],
//             }])
//         //switch case?
//         .then((answer) => {
//             switch (answer.chooseOption) {
//                 case "View all deaprtments.":
//                     viewAllDepartments();
//                     // db.query("SELECT * FROM departments", function (err, results) {
//                     //     if (err) {
//                     //         console.error(err)
//                     //     } else {
//                     //         console.log(results)
//                     //     }
//                     // });

//                     break;
//                 //function to view departments - query to view departments.
//                 default: console.log("Default")
//             }
//             // if (answer.chooseOption === "View all deaprtments.") {
//             //     console.log("Departments chosen")
//             //     return managerInputs();
//             // } else if (answer.chooseOption === ("View all roles.")) {
//             //     console.log("Roles chosen")
//             //     return engineerInputs();
//             // } else if (answer.chooseOption === "Intern") {
//             //     console.log("Intern chosen")
//             //     return internInputs();
//             // } else {

//             //     writeToFile();
//             // }
//         })
//         .catch((error) => console.error(error))
// };

// function viewAllDepartments() {
//     db.query("SELECT * FROM departments", function (err, results) {
//         if (err) {
//             console.error(err)
//         } else {
//             console.log(results)
//         }
//     })
// };


// module.exports = askQuestions;
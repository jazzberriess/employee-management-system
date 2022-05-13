//Required modules - don't need express!

const inquirer = require("inquirer");
const db = require("./config/connection");
// const inquirerPrompts = require("./src/helpers/inquirer");
// const mysql = require("mysql2");
const viewAllDepartments = require("./src/helpers/queries")

//dont need to require - just use like you would a console.log
// const consoleTable = require("console.table");

//require dotenv package to keep sql access credentials secure
require('dotenv').config();

//Setting up port
// const PORT = process.env.PORT || 3001;

// const db = mysql.createConnection(

//     {
//         host: 'localhost',
//         user: 'root',
//         password: process.env.DB_PASSWORD,
//         database: "employees_db",
//     },
//     console.log("Connected to the employees_db database.")

// );

//Setting variable for express
// const app = express();

//Express middleware to read JSON and urlencoded
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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
                    viewAllDepartments();
                    // db.query("SELECT * FROM departments", function (err, results) {
                    //     if (err) {
                    //         console.error(err)
                    //     } else {
                    //         console.log(results)
                    //     }
                    // });

                    break;
                //function to view departments - query to view departments.
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
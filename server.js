//Required modules
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

//require dotenv package to keep sql access credentials secure
require('dotenv').config()

//Setting up port
const PORT = process.env.PORT || 3001;

//Setting variable for express
const app = express();

//Express middleware to read JSON and urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Listening for the server
app.listen(PORT, () => {
    console.log(`We're live and running the server on port ${PORT}`)
})
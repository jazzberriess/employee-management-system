require('dotenv').config();
const mysql = require("mysql2");

const db = mysql.createConnection(

    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: "employees_db",
    },
    console.log("Connected to the employees_db database.")

);

module.exports = db;
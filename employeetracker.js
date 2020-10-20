const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeetracker_db"
});


connection.connect((err) => {
    if (err) throw err;
    init();
});

function init() {
    inquirer
        .prompt({
            type: "list",
            name: "begin",
            message: "Would you like to do?",
            choices: ["View Employees", "View Employees by Department", "Add Employee", "Remove Employee", "Update Employee", "Add Another Role", "Exit"]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Employees":
                    joinedTables();
                    break;

                case "View Employees by Department":
                    viewDepartment();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeRole();
                    break;

                case "Update Employee":
                    deleteEmployee();
                    break;

                case "Exit":
                    process.exit();
                    break;
            }
        });
};
const mysql = require("mysql");
const inquirer = require("inquirer");
const fs = require("fs");


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
            choices: ["View Employees", "View Employees by Department/Roles", "Add Employee/Department/Roles", "Remove Employee/Department/Roles", "Update Employee", "Exit"]
        })
        .then(function (answer) {
            switch (answer.begin) {
                case "View Employees":
                    joinedTables();
                    break;

                case "View Employees by Department/Roles":
                    viewDepartmentRoles();
                    break;

                case "Add Employee/Department/Roles":
                    addEmployeeDR();
                    break;

                case "Remove Employee/Department/Roles":
                    removeEmployeeDR();
                    break;

                case "Update Employee":
                    updateEmployee();
                    break;

                case "Exit":
                    process.exit();
                    break;
            }
        });
};


function viewDepartmentRoles() {
    inquirer
        .prompt({
            name: "begin",
            type: "list",
            message: "Please select what you would like to view",
            choices: ["Employees", "Departments", "Roles", "Return"],
        })

        .then(function (answer) {
            switch (answer.begin) {
                case "Employees":
                    viewEmployees();
                    break;

                case "Departments":
                    viewDepartments();
                    break;

                case "Roles":
                    viewRole();
                    break;

                case "Return":
                    init();
                    break;
            }
        });
};


function addEmployeeDR() {
    inquirer
        .prompt({
            name: "begin",
            type: "list",
            message: "Please select where you would like to add a new Employee/Deparment/Role",
            choices: ["Add New Employee", "Add New Department", "Add New Role", "Return"],
        })
        .then(function (answer) {
            switch (answer.begin) {
                case "Add New Employee":
                    addNewEmployee();
                    break;

                case "Add New Department":
                    addNewDepartments(); 
                    break;

                case "Add New Role":
                    addNewRole();
                    break;

                case "Return":
                    init();
            }
        });
};

function addNewEmployee() {

    let roleQ = "SELECT * FROM employeetracker_db.role;";
    let roleName = [];
    connection.query(roleQ, function (err, res) {
        for (let i = 0; i < res.length; i++) {
            roleName.push({name:res[i].title, value:res[i].id});
        }    
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Employee's first name",
                    name: "first_name",
                },
                {
                    type: "input",
                    message: "Employees last name",
                    name: "last_name",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the role of the Employee?",
                    choices: roleName,
                },
            ])
            .then(function (answer) {
                const sqlAddEmployee = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                connection.query(sqlAddEmployee, [answer.first_name, answer.last_name, answer.role, 1], (err, res) => {
                    if (err) throw err;
                    init()
                })

            }); 
    });	    
};

function addNewDepartments() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Name of the department?",
                name: "name",
            },
        ])
        .then(function (answer) {
            const sqlAddDepartment = "INSERT INTO department (name) VALUES ( ?)";
            connection.query(
                sqlAddDepartment,
                [answer.name],
                (err, res) => {
                    if (err) throw err;
                    console.log("Success")
                    init();
                }
            );
        });
};

function addNewRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Title of new role",
                name: "title",
            },
            {
                type: "input",
                message: "Salary of new role",
                name: "salary",
            },
            {
                type: "input",
                message: "New deparment ID number",
                name: "department_id",
            },
        ])
        .then(function (answer) {
            const sqlAddRole = "INSERT INTO role (title, salary, department_id ) VALUES ( ?, ?, ?, ?)";
            connection.query(
                sqlAddRole,
                [answer.title, answer.salary, answer.department_id], (err, res) => {
                    if (err) throw err;
                    console.log("Success");
                    init();
                }
            );
        });
};


function removeEmployeeDR() {
    inquirer
        .prompt({
            name: "begin",
            type: "list",
            message: "Please select what Information you would like to remove",
            choices: ["Remove Employee", "Remove Department", "Remove Role", "Return"],
        })

        .then(function (answer) {
            switch (answer.begin) {
                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Remove Department":
                    removeDepartments();
                    break;

                case "Remove Role":
                    removeRole();
                    break;

                case "Return":
                    init();
                    break;
            }
        });
};

function removeEmployee() {
    inquirer
        .prompt({
            name: "name",
            type: "input",
            message: "ID of employee you would like to remove from the system"
        })
        .then(function (answer) {
            const sqlDeleteEmp = "DELETE FROM employee WHERE id = ?";
            connection.query(sqlDeleteEmp, [answer.id], (err, res) => {
                if (err) throw err;
                console.log("Success")
                init()
            })
        })
};

function removeDepartments() {
    let departmentQ = "SELECT * FROM employeetracker_db.department;"
    let departmentName = [];
    connection.query(departmentQ, function (err, res) {
        for (let i = 0; i < res.length; i++) {
            departmentName.push({ name: res[i].name, value: res[i].id });
        }
        inquirer
            .prompt({
                name: "name",
                type: "list",
                message: "What department would you like to remove?",
                choices: departmentName,
            })
            .then(function(answer){

                const sqlDeleteDepart = "DELETE FROM department WHERE id = ?";
                connection.query(sqlDeleteDepart, [answer.name], (err, res) => {
                    if (err) throw err;
                    console.log("Success")
                    init()
                })
            })
    })
};


function removeRole() {
    let roleQ = `SELECT * FROM employeetracker_db.role;`;
    let roleName = [];
    connection.query(roleQ, function (err, res) {
        for (let i = 0; i < res.length; i++) {
            roleName.push({ name: res[i].title, value: res[i].id });
        }
        inquirer
            .prompt({

                name: "title",
                type: "list",
                message: "What role would you like to remove?",
                choices: roleName,
            })
            .then(function (answer) {
                const sqlDelRole = `DELETE FROM role WHERE id = ?`;
                connection.query(sqlDelRole, [answer.title], (err, res) => {
                    if (err) throw err;
                    console.log("Success")
                    init()
                })
            })
    });
};

function viewEmployees() {
    const sqlViewEmployee = `SELECT id, first_name, last_name FROM employeetracker_db.employee`;
    connection.query(sqlViewEmployee, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function viewDepartments() {
    const sqlViewDepartment = `SELECT * FROM department`;
    connection.query(sqlViewDepartment, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};


function viewRole() {
    const sqlViewRole = `SELECT * FROM role`;
    connection.query(sqlViewRole, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

function updateEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Employee's ID Number",
                name: "id",
            },
            {
                type: "input",
                message: "New role of Employee",
                name: "role_id",
            },
        ])
        .then(function (answer) {
            const sqlUpdaterole = `UPDATE employee SET role_id = ? WHERE id = ?`;
            connection.query(sqlUpdaterole, [answer.role_id, answer.id], (err, res) => {
                if (err) throw err;
                console.log("Success");
                joinedTables();
            });
        })
};

async function joinedTables() {
    let query = `
            SELECT employee.id, first_name, last_name, title, salary, name AS department, manager_id FROM employee 
            LEFT JOIN role 
            ON employee.role_id = role.id LEFT JOIN department
            ON department.id = role.department_id
        `;

    await connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        init();
    })
};
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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });
  
  function afterConnection() {
    connection.query("SELECT * FROM songs", function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
  }

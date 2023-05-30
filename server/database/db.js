/*const mysql = require('mysql2');

const pool = mysql.createPool({
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME

});

module.exports = pool;
*/

const mysql = require("mysql2");
const connection = mysql.createPool({
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME

});


connection.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});
module.exports = connection;
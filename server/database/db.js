const mysql = require("mysql");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "orderingsysdb",
});

connection.getConnection((err, conn) => {
  if (err) {
    console.log("Error connection to the database", err.message);
    return;
  }
  if (conn) conn.release();
  console.log("Connected to the database successfully!");
});

module.exports = connection;

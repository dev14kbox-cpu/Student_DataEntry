// db.js
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "192002",
  database: "student_management",
  port: 3306,     // XAMPP MySQL port
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
    connection.release();
  }
});

module.exports = db;

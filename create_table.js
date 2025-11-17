const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '192002',
  database: 'student_management'
});

db.connect((err) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Connected');
    db.query(`CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      role VARCHAR(255) DEFAULT 'Admin',
      phone VARCHAR(50),
      address TEXT,
      department VARCHAR(255) DEFAULT 'Administration',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err, results) => {
      if (err) {
        console.log('Create table error:', err);
      } else {
        console.log('Users table created');
      }
      db.end();
    });
  }
});

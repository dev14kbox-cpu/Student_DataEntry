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
    db.query(`INSERT INTO users (email, password, firstName, lastName, role, phone, address, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      'admin@school.com',
      'admin123',
      'Admin',
      'User',
      'System Administrator',
      '',
      '',
      'Administration'
    ], (err, results) => {
      if (err) {
        console.log('Insert error:', err);
      } else {
        console.log('Admin user inserted, ID:', results.insertId);
      }
      db.end();
    });
  }
});

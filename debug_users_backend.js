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
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.log('Query error:', err);
      } else {
        console.log('Backend MySQL Users:');
        console.log(JSON.stringify(results, null, 2));
      }
      db.end();
    });
  }
});

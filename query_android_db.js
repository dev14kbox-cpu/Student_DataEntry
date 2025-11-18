const Database = require('better-sqlite3');

// Open the SQLite database - check the android folder
const db = new Database('./android/StudentDatabase.db', { verbose: console.log });

// Query to get all tables
const getTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
const tables = getTables.all();

console.log('Tables in android/StudentDatabase.db:');
console.log(tables);

// Check if users table exists
const usersTable = tables.find(table => table.name === 'users');
if (usersTable) {
  // Query to get all users
  const getUsers = db.prepare('SELECT * FROM users');
  const users = getUsers.all();

  console.log('\nUsers in android/StudentDatabase.db:');
  console.log(JSON.stringify(users, null, 2));
} else {
  console.log('\nUsers table does not exist in android/StudentDatabase.db');
}

// Check if students table exists
const studentsTable = tables.find(table => table.name === 'students');
if (studentsTable) {
  // Query to get all students
  const getStudents = db.prepare('SELECT * FROM students');
  const students = getStudents.all();

  console.log('\nStudents in android/StudentDatabase.db:');
  console.log(JSON.stringify(students, null, 2));
} else {
  console.log('\nStudents table does not exist in android/StudentDatabase.db');
}

// Close the database
db.close();

const { getAllUsers } = require('./src/database/DatabaseService');

getAllUsers().then(users => {
  console.log('Local SQLite Users:');
  console.log(JSON.stringify(users, null, 2));
}).catch(err => {
  console.error('Error:', err);
});

const SQLite = require('react-native-sqlite-2');

// Open SQLite DB
const db = SQLite.openDatabase("StudentDatabase.db", "1.0", "", 1);

const deleteAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM users",
        [],
        () => {
          console.log("All users deleted from local database");
          resolve(true);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Execute the deletion
deleteAllUsers().then(() => {
  console.log("Deletion completed successfully");
  process.exit(0);
}).catch(err => {
  console.error("Error deleting users:", err);
  process.exit(1);
});

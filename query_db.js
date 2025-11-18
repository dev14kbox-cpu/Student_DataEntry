const sqlite3 = require("sqlite3").verbose();

console.log("Opening SQLite DB…");

const db = new sqlite3.Database("./StudentDatabase.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error("❌ Failed to open DB:", err.message);
  }
  console.log("✅ Database opened successfully");
});

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
  if (err) {
    console.error("❌ Error fetching tables:", err);
    return;
  }

  console.log("\nTables in SQLite DB:");
  console.log(rows);

  const tableNames = rows.map((r) => r.name);

  if (!tableNames.includes("users")) {
    console.log("\n❌ Users table does NOT exist");
  } else {
    console.log("\n✅ Users table exists");
    db.all("SELECT * FROM users", (_, res) => console.log("Users:", res));
  }

  if (!tableNames.includes("students")) {
    console.log("\n❌ Students table does NOT exist");
  } else {
    console.log("\n✅ Students table exists");
    db.all("SELECT * FROM students", (_, res) => console.log("Students:", res));
  }

  console.log("\n✔ Task Completed");
});

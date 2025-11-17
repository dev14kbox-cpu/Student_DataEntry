// // src/database/DatabaseService.js

// import SQLite from "react-native-sqlite-2";

// // Open SQLite DB
// const db = SQLite.openDatabase("StudentDatabase.db", "1.0", "", 1);

// /* -----------------------------------------------------
//    INITIALIZE DATABASE (Users + Students)
// ----------------------------------------------------- */
// export const initDatabase = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       /* ---------------- USERS TABLE ---------------- */
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS users (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           email TEXT UNIQUE NOT NULL,
//           password TEXT NOT NULL,
//           firstName TEXT NOT NULL,
//           lastName TEXT NOT NULL,
//           phone TEXT,
//           address TEXT,
//           department TEXT,
//           role TEXT DEFAULT 'Admin',
//           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
//         )`,
//         [],
//         () => console.log("Users table ready"),
//         (_, error) => {
//           console.log("Users table error:", error);
//           reject(error);
//           return true;
//         }
//       );

//       /* ------------- STUDENTS TABLE --------------- */
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS students (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           fullName TEXT NOT NULL,
//           email TEXT NOT NULL,
//           mobile TEXT NOT NULL,
//           course TEXT NOT NULL,
//           admissionDate TEXT NOT NULL,
//           street TEXT,
//           city TEXT,
//           state TEXT,
//           postalCode TEXT,
//           status TEXT DEFAULT 'Pending',
//           isSynced INTEGER DEFAULT 0,        -- 0 = not synced, 1 = synced
//           createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
//         )`,
//         [],
//         () => {
//           console.log("Students table ready");
//           resolve();
//         },
//         (_, error) => {
//           console.log("Students table error:", error);
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    SEED DEFAULT ADMIN
// ----------------------------------------------------- */
// export const seedDefaultAdmin = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT COUNT(*) as count FROM users",
//         [],
//         (_, results) => {
//           const count = results.rows.item(0).count;

//           if (count === 0) {
//             tx.executeSql(
//               `INSERT INTO users 
//                 (email, password, firstName, lastName, phone, address, department, role)
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//               [
//                 "admin@school.com",
//                 "admin123",
//                 "Admin",
//                 "User",
//                 "",
//                 "",
//                 "Administration",
//                 "System Administrator",
//               ],
//               () => {
//                 console.log("Default admin created");
//                 resolve();
//               },
//               (_, error) => {
//                 console.log("Admin seed error:", error);
//                 reject(error);
//                 return true;
//               }
//             );
//           } else {
//             resolve();
//           }
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    LOGIN USER
// ----------------------------------------------------- */
// export const authenticateUser = (email, password) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM users WHERE email = ? AND password = ?",
//         [email, password],
//         (_, results) => {
//           if (results.rows.length > 0) {
//             let user = results.rows.item(0);
//             delete user.password;
//             resolve(user);
//           } else {
//             reject(new Error("Invalid credentials"));
//           }
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    CREATE NEW USER
// ----------------------------------------------------- */
// export const createUser = (userData) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `INSERT INTO users 
//           (email, password, firstName, lastName, phone, address, department, role)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           userData.email,
//           userData.password,
//           userData.firstName,
//           userData.lastName,
//           userData.phone || "",
//           userData.address || "",
//           userData.department || "Administration",
//           userData.role || "Admin",
//         ],
//         (_, results) => {
//           tx.executeSql(
//             "SELECT id, email, firstName, lastName, phone, address, department, role FROM users WHERE id = ?",
//             [results.insertId],
//             (_, userResult) => resolve(userResult.rows.item(0)),
//             (_, error) => reject(error)
//           );
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    UPDATE USER PROFILE (Improved Error Logging)
// ----------------------------------------------------- */
// export const updateUser = (id, data) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `
//           UPDATE users SET 
//             firstName=?, 
//             lastName=?, 
//             email=?, 
//             phone=?, 
//             address=?, 
//             department=?
//           WHERE id=?`,
//         [
//           data.firstName,
//           data.lastName,
//           data.email,
//           data.phone,
//           data.address,
//           data.department,
//           id,
//         ],
//         () => resolve(true),
//         (_, error) => { 
//             // Log the error for console debugging
//             console.error("SQLITE UPDATE USER ERROR:", error);
//             reject(error);
//             return true;
//         }
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    STUDENT METHODS (Unchanged)
// ----------------------------------------------------- */
// export const getAllStudents = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM students ORDER BY createdAt DESC",
//         [],
//         (_, results) => {
//           let students = [];
//           for (let i = 0; i < results.rows.length; i++) {
//             students.push(results.rows.item(i));
//           }
//           resolve(students);
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const addStudent = (data) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `INSERT INTO students 
//           (fullName, email, mobile, course, admissionDate, street, city, state, postalCode, isSynced)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
//         [
//           data.fullName,
//           data.email,
//           data.mobile,
//           data.course,
//           data.admissionDate,
//           data.street,
//           data.city,
//           data.state,
//           data.postalCode,
//         ],
//         (_, results) => resolve({ id: results.insertId, ...data }),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const updateStudent = (id, data) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `UPDATE students SET 
//           fullName=?, email=?, mobile=?, course=?, admissionDate=?,
//           street=?, city=?, state=?, postalCode=?, isSynced=0 
//          WHERE id=?`,
//         [
//           data.fullName,
//           data.email,
//           data.mobile,
//           data.course,
//           data.admissionDate,
//           data.street,
//           data.city,
//           data.state,
//           data.postalCode,
//           id,
//         ],
//         () => resolve(true),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const deleteStudent = (id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DELETE FROM students WHERE id = ?",
//         [id],
//         () => resolve(true),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    SYNC SYSTEM — FETCH UNSYNCED RECORDS
// ----------------------------------------------------- */
// export const getUnsyncedStudents = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT * FROM students WHERE isSynced = 0",
//         [],
//         (_, results) => {
//           let list = [];
//           for (let i = 0; i < results.rows.length; i++) {
//             list.push(results.rows.item(i));
//           }
//           resolve(list);
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    MARK STUDENTS AS SYNCED
// ----------------------------------------------------- */
// export const markStudentsSynced = (ids = []) => {
//   if (ids.length === 0) return;

//   const placeholders = ids.map(() => "?").join(",");

//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `UPDATE students SET isSynced = 1 WHERE id IN (${placeholders})`,
//         ids,
//         () => resolve(true),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    GET ALL USERS (for debugging)
// ----------------------------------------------------- */
// export const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users ORDER BY createdAt DESC",
//         [],
//         (_, results) => {
//           let users = [];
//           for (let i = 0; i < results.rows.length; i++) {
//             users.push(results.rows.item(i));
//           }
//           resolve(users);
//         },
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// /* -----------------------------------------------------
//    COUNTS FOR DASHBOARD
// ----------------------------------------------------- */
// export const getStudentTotalCount = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT COUNT(*) AS total FROM students",
//         [],
//         (_, results) => resolve(results.rows.item(0).total),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export const getPendingCount = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT COUNT(*) AS total FROM students WHERE status = 'Pending'",
//         [],
//         (_, results) => resolve(results.rows.item(0).total),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

// export default db;





// -----------------------------------------------------


// src/database/DatabaseService.js
import SQLite from "react-native-sqlite-2";

// Open SQLite DB
const db = SQLite.openDatabase("StudentDatabase.db", "1.0", "", 1);

/* -----------------------------------------------------
   INITIALIZE DATABASE (Users + Students)
----------------------------------------------------- */
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      console.log("📌 Initializing SQLite DB...");

      /* ---------------- USERS TABLE ---------------- */
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          department TEXT,
          role TEXT DEFAULT 'Admin',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        [],
        () => console.log("✔ Users table OK"),
        (_, error) => {
          console.log("❌ Users table error:", error);
          reject(error);
          return true;
        }
      );

      /* ------------- STUDENTS TABLE --------------- */
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          email TEXT NOT NULL,
          mobile TEXT NOT NULL,
          course TEXT NOT NULL,
          admissionDate TEXT NOT NULL,
          street TEXT,
          city TEXT,
          state TEXT,
          postalCode TEXT,
          status TEXT DEFAULT 'Pending',
          isSynced INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        [],
        () => {
          console.log("✔ Students table OK");
          resolve();
        },
        (_, error) => {
          console.log("❌ Students table error:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

/* -----------------------------------------------------
   SEED DEFAULT ADMIN
----------------------------------------------------- */
export const seedDefaultAdmin = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT COUNT(*) as count FROM users",
        [],
        (_, results) => {
          const count = results.rows.item(0).count;

          if (count === 0) {
            console.log("🟡 Creating default admin...");

            tx.executeSql(
              `INSERT INTO users 
                (email, password, firstName, lastName, phone, address, department, role)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                "admin@school.com",
                "admin123",
                "Admin",
                "User",
                "",
                "",
                "Administration",
                "System Administrator",
              ],
              () => {
                console.log("✔ Default admin created");
                resolve();
              },
              (_, error) => {
                console.log("❌ Admin seed error:", error);
                reject(error);
                return true;
              }
            );
          } else {
            console.log("✔ Admin exists already");
            resolve();
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

/* -----------------------------------------------------
   LOGIN USER
----------------------------------------------------- */
export const authenticateUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (_, results) => {
          if (results.rows.length > 0) {
            let user = results.rows.item(0);
            delete user.password;
            resolve(user);
          } else {
            reject(new Error("Invalid credentials"));
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

/* -----------------------------------------------------
   CREATE NEW USER
----------------------------------------------------- */
export const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO users 
          (email, password, firstName, lastName, phone, address, department, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
          userData.password,
          userData.firstName,
          userData.lastName,
          userData.phone || "",
          userData.address || "",
          userData.department || "Administration",
          userData.role || "Admin",
        ],
        (_, results) => {
          tx.executeSql(
            "SELECT id, email, firstName, lastName, phone, address, department, role FROM users WHERE id = ?",
            [results.insertId],
            (_, userResult) => resolve(userResult.rows.item(0)),
            (_, error) => reject(error)
          );
        },
        (_, error) => {
          console.log("❌ SQLITE INSERT USER ERROR:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

/* -----------------------------------------------------
   UPDATE USER (Local SQLite)
----------------------------------------------------- */
export const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE users SET 
          firstName=?, 
          lastName=?, 
          email=?, 
          phone=?, 
          address=?, 
          department=?
         WHERE id=?`,
        [
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          data.address,
          data.department,
          id,
        ],
        () => resolve(true),
        (_, error) => {
          console.error("❌ SQLITE UPDATE USER ERROR:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

/* -----------------------------------------------------
   STUDENTS CRUD (UNCHANGED)
----------------------------------------------------- */
export const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM students ORDER BY createdAt DESC",
        [],
        (_, results) => {
          let students = [];
          for (let i = 0; i < results.rows.length; i++) {
            students.push(results.rows.item(i));
          }
          resolve(students);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const addStudent = (data) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO students 
          (fullName, email, mobile, course, admissionDate, street, city, state, postalCode, isSynced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          data.fullName,
          data.email,
          data.mobile,
          data.course,
          data.admissionDate,
          data.street,
          data.city,
          data.state,
          data.postalCode,
        ],
        (_, results) => resolve({ id: results.insertId, ...data }),
        (_, error) => reject(error)
      );
    });
  });
};

export const updateStudent = (id, data) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE students SET 
          fullName=?, email=?, mobile=?, course=?, admissionDate=?,
          street=?, city=?, state=?, postalCode=?, isSynced=0 
         WHERE id=?`,
        [
          data.fullName,
          data.email,
          data.mobile,
          data.course,
          data.admissionDate,
          data.street,
          data.city,
          data.state,
          data.postalCode,
          id,
        ],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM students WHERE id = ?",
        [id],
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};

/* -----------------------------------------------------
   SYNC SYSTEM
----------------------------------------------------- */
export const getUnsyncedStudents = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM students WHERE isSynced = 0",
        [],
        (_, results) => {
          let list = [];
          for (let i = 0; i < results.rows.length; i++) {
            list.push(results.rows.item(i));
          }
          resolve(list);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const markStudentsSynced = (ids = []) => {
  if (ids.length === 0) return;

  const placeholders = ids.map(() => "?").join(",");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE students SET isSynced = 1 WHERE id IN (${placeholders})`,
        ids,
        () => resolve(true),
        (_, error) => reject(error)
      );
    });
  });
};

/* -----------------------------------------------------
   GET ALL USERS
----------------------------------------------------- */
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users ORDER BY createdAt DESC",
        [],
        (_, results) => {
          let users = [];
          for (let i = 0; results.rows[i]; i++) {
            users.push(results.rows.item(i));
          }
          resolve(users);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export default db;

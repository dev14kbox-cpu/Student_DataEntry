// // routes.js
// const express = require("express");
// const router = express.Router();
// const db = require("./db");

// // -----------------------------
// // UPDATE USER PROFILE (by email)
// // -----------------------------
// router.put("/update-profile", (req, res) => {
//   console.log("Update profile request received");
//   console.log("Request body:", req.body);
//   console.log("req.body type:", typeof req.body);

//   if (!req.body) {
//     console.log("req.body is undefined!");
//     return res.status(400).json({ message: "Request body is missing" });
//   }

//   const { firstName, lastName, email, phone, address, department } = req.body;

//   if (!firstName || !lastName || !email) {
//     return res.status(400).json({ message: "First name, last name and email are required" });
//   }

//   // First, try to update existing user
//   db.query(
//     `
//     UPDATE users SET
//       firstName = ?,
//       lastName = ?,
//       phone = ?,
//       address = ?,
//       department = ?
//     WHERE email = ?
//     `,
//     [firstName, lastName, phone || "", address || "", department || "Administration", email],
//     (err, result) => {
//       if (err) {
//         console.log("Update profile error:", err);
//         // Important: Return 409 if a UNIQUE constraint (like email) fails
//         if (err.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ message: "This email is already in use." });
//         }
//         return res.status(500).json({ message: "Failed to update profile" });
//       }

//       if (result.affectedRows > 0) {
//         // User was updated successfully
//         res.json({ message: "Profile updated successfully" });
//       } else {
//         // User not found, insert new user
//         db.query(
//           `
//         INSERT INTO users (firstName, lastName, email, password, phone, address, department, role, createdAt)
// VALUES (?, ?, ?, ?, ?, ?, ?, 'System Administrator', NOW())
//           `,
//           [firstName, lastName, email, phone || "", address || "", department || "Administration"],
//           (insertErr, insertResult) => {
//             if (insertErr) {
//               console.log("Insert user error:", insertErr);
//               if (insertErr.code === 'ER_DUP_ENTRY') {
//                 return res.status(409).json({ message: "This email is already in use." });
//               }
//               return res.status(500).json({ message: "Failed to create user profile" });
//             }

//             res.json({ message: "Profile created and updated successfully" });
//           }
//         );
//       }
//     }
//   );
// });

// // GET ALL USERS (for debugging)
// router.get("/users", (req, res) => {
//   db.query("SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users", (err, results) => {
//     if (err) {
//       console.log("Get users error:", err);
//       return res.status(500).json({ message: "Failed to fetch users" });
//     }
//     res.json({ users: results });
//   });
// });

// module.exports = router;
// apiRoutes.js
const express = require("express");
const router = express.Router();
const db = require("./db");
const crypto = require("crypto");

// Optional: for production you should hash passwords. If you install bcrypt, uncomment below:
// const bcrypt = require("bcrypt"); // npm i bcrypt
// const HASH_SALT_ROUNDS = 10;

// Simple email validator (good enough for basic checks)
const emailIsValid = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper: generate a secure random password (hex)
const generateRandomPassword = (length = 10) =>
  crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);

// ---------------------------------------------
// UPDATE USER PROFILE (SAFE, CLEAN, SINGLE ROUTE)

// ---------------------------------------------
// .................................................

router.post("/get-user-by-email", (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email required" });

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (rows.length === 0) return res.json({ id: 0 });

    return res.json({ id: rows[0].id });
  });
});


// .........................................................
router.put("/update-profile", (req, res) => {
  try {
    if (!req.body) {
      console.log("Request body missing");
      return res.status(400).json({ message: "Request body is required" });
    }
const doInsert = (passwordToStore) => {
  const insertSql = `
    INSERT INTO users
      (email, password, firstName, lastName, role, phone, address, department, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const insertParams = [
    email,
    passwordToStore,
    firstName,
    lastName,
    'Admin',
    phone,
    address,
    department
  ];

  db.query(insertSql, insertParams, (insertErr, insertRes) => {
    if (insertErr) {
      console.error("Insert user error:", insertErr);
      if (insertErr.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Failed to create new user" });
    }

    // Return created user
    db.query(
      "SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users WHERE id = ?",
      [insertRes.insertId],
      (fetchErr, fetchRows) => {
        if (fetchErr) {
          console.error("Fetch new user error:", fetchErr);
          return res.status(201).json({ message: "New profile created" });
        }
        return res.status(201).json({ message: "New profile created", user: fetchRows[0] });
      }
    );
  });
};

    // Accept either number or string id — normalize to integer
    const rawId = req.body.id;
    const id = rawId !== undefined ? parseInt(rawId, 10) : undefined;
    console.log("Raw id from request:", rawId, "Parsed id:", id, "Is NaN:", isNaN(id));

    const {
      firstName,
      lastName,
      email,
      phone = "",
      address = "",
      department = "Administration",
    } = req.body;

    // Basic validations
    if (id !== undefined && (isNaN(id) || !Number.isInteger(id) || id < 0)) {
      console.log("Invalid id:", id, "type:", typeof id);
      return res.status(400).json({ message: "Valid numeric user id is required (must be >= 0)" });
    }
    if (!email || !emailIsValid(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First and last name are required" });
    }

    console.log("Update profile request received for id:", id);

    // 1️⃣ Check if user exists by id
    db.query("SELECT * FROM users WHERE id = ?", [id], (selectErr, rows) => {
      if (selectErr) {
        console.error("Select user error:", selectErr);
        return res.status(500).json({ message: "Database error" });
      }

      // Helper to check if provided email belongs to another user
      const checkEmailConflict = (cb) => {
        if (id === undefined || id === 0) {
          // If no id or id is 0, just check if email exists
          db.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email],
            (emailErr, emailRows) => {
              if (emailErr) {
                console.error("Email conflict check error:", emailErr);
                return cb(emailErr);
              }
              // if any row, conflict exists
              const conflict = emailRows && emailRows.length > 0;
              cb(null, conflict);
            }
          );
        } else {
          db.query(
            "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
            [email, id],
            (emailErr, emailRows) => {
              if (emailErr) {
                console.error("Email conflict check error:", emailErr);
                return cb(emailErr);
              }
              // if any row, conflict exists
              const conflict = emailRows && emailRows.length > 0;
              cb(null, conflict);
            }
          );
        }
      };

      // If user exists -> UPDATE
      if (rows.length > 0) {
        checkEmailConflict((emailCheckErr, conflict) => {
          if (emailCheckErr) {
            return res.status(500).json({ message: "Database error" });
          }
          if (conflict) {
            return res.status(409).json({ message: "Email already in use by another account" });
          }

          const updateSql = `
            UPDATE users SET
              firstName = ?,
              lastName = ?,
              email = ?,
              phone = ?,
              address = ?,
              department = ?
            WHERE id = ?
          `;
          const params = [firstName, lastName, email, phone, address, department, id];

          db.query(updateSql, params, (updateErr, updateRes) => {
            if (updateErr) {
              console.error("Update error:", updateErr);
              if (updateErr.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Email already exists" });
              }
              return res.status(500).json({ message: "Failed to update user" });
            }

            // Return the updated user object (recommended)
            db.query(
              "SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users WHERE id = ?",
              [id],
              (fetchErr, fetchRows) => {
                if (fetchErr) {
                  console.error("Fetch updated user error:", fetchErr);
                  return res.status(200).json({ message: "Profile updated successfully" });
                }
                return res.status(200).json({ message: "Profile updated successfully", user: fetchRows[0] });
              }
            );
          });
        });

        return;
      }

      // If user does NOT exist -> INSERT NEW USER
      // Create a secure random password (you should hash in production)
      const plainPassword = generateRandomPassword(12);

      // Optionally hash the password if bcrypt is available:
      const doInsert = (passwordToStore) => {
        const insertSql = `
          INSERT INTO users
  (email, password, firstName, lastName, phone, address, department, role, createdAt)
VALUES (?, ?, ?, ?, ?, ?, ?, 'Admin', NOW())
        `;
        const insertParams = [email, passwordToStore, firstName, lastName, phone, address, department];

        db.query(insertSql, insertParams, (insertErr, insertRes) => {
          if (insertErr) {
            console.error("Insert user error:", insertErr);
            if (insertErr.code === "ER_DUP_ENTRY") {
              return res.status(409).json({ message: "Email already exists" });
            }
            return res.status(500).json({ message: "Failed to create new user" });
          }

          // Return created user (without password)
          db.query(
            "SELECT id, email, firstName, lastName, phone, address, department, role, createdAt FROM users WHERE id = ?",
            [insertRes.insertId],
            (fetchErr, fetchRows) => {
              if (fetchErr) {
                console.error("Fetch new user error:", fetchErr);
                return res.status(201).json({ message: "New profile created" });
              }
              // In production you would email the plainPassword to the user (or force reset)
              return res.status(201).json({ message: "New profile created", user: fetchRows[0] });
            }
          );
        });
      };

      // If you installed bcrypt and want hashing, uncomment and use it:
      /*
      bcrypt.hash(plainPassword, HASH_SALT_ROUNDS)
        .then((hash) => doInsert(hash))
        .catch((hashErr) => {
          console.error("Password hashing error:", hashErr);
          return res.status(500).json({ message: "Failed to create user (password error)" });
        });
      */

      // Default behavior: store random password as-is (NOT recommended for production)
      doInsert(plainPassword);
    });
  } catch (ex) {
    console.error("Unexpected error in update-profile:", ex);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

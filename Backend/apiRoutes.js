const express = require("express");
const router = express.Router();
const db = require("./db");

function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// GET user by email
router.post("/get-user-by-email", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length > 0) {
      res.json({ id: results[0].id });
    } else {
      res.json({ id: 0 });
    }
  });
});

// PUT update profile
router.put("/update-profile", (req, res) => {
  const { id, firstName, lastName, email, phone, address, department } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: "First name, last name and email are required" });
  }

  // Try to update by id if provided, else by email
  let whereClause = "email = ?";
  let whereValue = email;
  if (id && id > 0) {
    whereClause = "id = ?";
    whereValue = id;
  }

  db.query(
    "UPDATE users SET firstName = ?, lastName = ?, phone = ?, address = ?, department = ? WHERE " + whereClause,
    [firstName, lastName, phone || "", address || "", department || "Administration", whereValue],
    (err, result) => {
      if (err) {
        console.log("Update error:", err);
        return res.status(500).json({ message: "Failed to update profile" });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: "Profile updated successfully" });
      } else {
        // Insert new user
        const password = generateRandomPassword(12);
        db.query(
          "INSERT INTO users (firstName, lastName, email, password, phone, address, department, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'Admin', NOW())",
          [firstName, lastName, email, password, phone || "", address || "", department || "Administration"],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.log("Insert error:", insertErr);
              return res.status(500).json({ message: "Failed to create profile" });
            }
            return res.status(201).json({ message: "Profile created successfully" });
          }
        );
      }
    }
  );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");

// RECEIVE UNSYNCED DATA
router.post("/sync-students", (req, res) => {
  const students = req.body.students;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No data received" });
  }

  let successCount = 0;

  students.forEach((s) => {
    db.query(
      `
      INSERT INTO students
      (id, fullName, email, mobile, course, admissionDate, street, city, state, postalCode, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        fullName = VALUES(fullName),
        email = VALUES(email),
        mobile = VALUES(mobile),
        course = VALUES(course),
        admissionDate = VALUES(admissionDate),
        street = VALUES(street),
        city = VALUES(city),
        state = VALUES(state),
        postalCode = VALUES(postalCode)
    `,
      [
        s.id,
        s.fullName,
        s.email,
        s.mobile,
        s.course,
        s.admissionDate,
        s.street,
        s.city,
        s.state,
        s.postalCode,
        s.createdAt,
      ],
      (err) => {
        if (!err) successCount++;
      }
    );
  });

  res.json({
    message: "Sync completed",
    synced: successCount,
    total: students.length,
  });
});

// GET SYNC STUDENTS - Return paginated students for sync
router.get("/sync-students", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100; // Default 100 for sync
  const offset = (page - 1) * limit;

  // First get total count
  db.query("SELECT COUNT(*) as total FROM students", (err, countResult) => {
    if (err) {
      console.log("Get sync students count error:", err);
      return res.status(500).json({ message: "Failed to fetch students count" });
    }

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Then get paginated data
    db.query(
      "SELECT * FROM students ORDER BY createdAt DESC LIMIT ? OFFSET ?",
      [limit, offset],
      (err, results) => {
        if (err) {
          console.log("Get sync students error:", err);
          return res.status(500).json({ message: "Failed to fetch students" });
        }

        res.json({
          students: results,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalRecords,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        });
      }
    );
  });
});

module.exports = router;

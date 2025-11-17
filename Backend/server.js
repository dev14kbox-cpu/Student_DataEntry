// // server.js
// console.log("Loaded API routes from:", require.resolve("./apiRoutes"));

// console.log("Loaded routes:", require.resolve("./apiRoutes"));
// console.log("Loaded sync routes:", require.resolve("./routes/sync"));

// // server.js
// const express = require("express");
// const app = express();
// const cors = require("cors");

// // Debug: show exactly which routes file is loaded
// console.log("Loaded API routes from:", require.resolve("./apiRoutes"));
// console.log("Loaded routes:", require.resolve("./apiRoutes"));
// console.log("Loaded sync routes:", require.resolve("./routes/sync"));

// // Load route files
// const apiRoutes = require("./apiRoutes");  // <-- FIXED
// const syncRoutes = require("./routes/sync");

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Mount routes
// app.use("/api", apiRoutes);
// app.use("/api", syncRoutes);

// // Run server
// const PORT = 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
// });



// ..............


console.log("Loaded API routes from:", require.resolve("./apiRoutes"));

console.log("Loaded routes:", require.resolve("./apiRoutes"));
console.log("Loaded sync routes:", require.resolve("./routes/sync"));
// server.js
const express = require("express");
const app = express();
const cors = require("cors");

// Force-load the correct file (not a folder)
console.log("Loaded API routes from:", require.resolve("./apiRoutes.js"));
console.log("Loaded sync routes from:", require.resolve("./routes/sync.js"));

// Import route files
const apiRoutes = require("./apiRoutes.js");  // <-- IMPORTANT: .js included
const syncRoutes = require("./routes/sync.js");

// Middleware
app.use(cors());
app.use(express.json());

// Attach routes
app.use("/api", apiRoutes);
app.use("/api", syncRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

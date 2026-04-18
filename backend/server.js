// Entry point for starting the backend server
require("dotenv").config({ override: true });

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

// Connect to database first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });

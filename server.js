require("dotenv").config();
const express = require("express");
const cors = require("cors");
const checkLicense = require("./middleware/auth");
const describeRoute = require("./routes/describe");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check — open this in browser to confirm server is running
app.get("/", (req, res) => {
  res.json({
    status: "Timesheet AI Server is running ",
    version: "1.0.0",
  });
});

// Protected routes — license key required
app.use("/api/describe", checkLicense, describeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

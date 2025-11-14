const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/* Serve static public folder for pi.toml */
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("GMOP Token Server is running on Render.");
});

/* Simple API to check status */
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    issuer: process.env.ISSUER_SECRET ? "loaded" : "missing",
    distributor: process.env.DISTRIBUTOR_SECRET ? "loaded" : "missing"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

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

// ====== API STATUS ======
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    issuer: process.env.ISSUER_SECRET ? "loaded" : "missing",
    distributor: process.env.DISTRIBUTOR_SECRET ? "loaded" : "missing"
  });
});

// ====== API: RUN CREATE TOKEN SCRIPT ======
app.get("/run/create-gmop", async (req, res) => {
  try {
    const create = require("./gmop/create-token.js");
    create().then(() => {
      res.send("GMOP token created.");
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// ====== API: RUN SET HOME DOMAIN SCRIPT ======
app.get("/run/set-home", async (req, res) => {
  try {
    const setHome = require("./gmop/domain.js");
    setHome().then(() => {
      res.send("Home domain set.");
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

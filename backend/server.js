// const dns = require('dns');
// dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use(express.json());
app.use("/api/auth", authRoutes);

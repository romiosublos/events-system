const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// simple test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
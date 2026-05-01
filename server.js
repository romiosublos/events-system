const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEMP STORAGE (memory)
let events = [];

// 🌐 ROOT TEST
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 📥 GET EVENTS
app.get("/events", (req, res) => {
  res.json(events);
});

// ➕ ADD EVENT
app.post("/events", (req, res) => {
  const event = {
    id: Date.now(),
    name: req.body.name,
    date: req.body.date,
    image: req.body.image || "",
    meeting: req.body.meeting || "",
    attendance: req.body.attendance || "",
    media: req.body.media || ""
  };

  events.push(event);
  res.json({ message: "Event added", event });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

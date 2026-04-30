const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let events = [];

// GET events
app.get("/events", (req,res)=>{
  res.json(events);
});

// ADD event
app.post("/events", (req,res)=>{
  events.push(req.body);
  res.json({message:"added"});
});

app.listen(3000, ()=>{
  console.log("Server running");
});
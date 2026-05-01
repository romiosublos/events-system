const express = require("express");
const cors = require("cors");
const firebase = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Firebase Admin (YOU MUST ADD KEY FILE)
const serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = firebase.database();

// 🌐 GET EVENTS
app.get("/events", async (req, res) => {
  const snap = await db.ref("events").get();
  res.json(snap.val() || {});
});

// ➕ ADD EVENT
app.post("/events", async (req, res) => {
  const newRef = db.ref("events").push();

  await newRef.set(req.body);

  res.json({ message: "Event added" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

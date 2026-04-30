const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref("events").on("value", snap=>{
  const data = snap.val() || {};
  const box = document.getElementById("events");
  box.innerHTML = "";

  Object.keys(data).forEach(id=>{
    const e = data[id];

    box.innerHTML += `
      <div class="event">
        <h3>${e.name}</h3>
        <p>${e.date}</p>
      </div>
    `;
  });
});
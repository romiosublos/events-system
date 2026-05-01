// 🔥 Firebase Config (YOUR REAL PROJECT)
const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alghad-nursery"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();


// 🔐 LOGIN
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login success ✅");
      document.getElementById("loginBox").style.display = "none";
    })
    .catch(err => {
      alert(err.code + "\n" + err.message);
    });
}


// 👀 SHOW ADMIN PANEL
auth.onAuthStateChanged(user => {
  document.getElementById("adminPanel").style.display = user ? "block" : "none";
});


// ➕ ADD EVENT
function addEvent(){
  db.ref("events").push({
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    image: document.getElementById("image").value || "",
    meeting: document.getElementById("meeting").value || "",
    attendance: document.getElementById("attendance").value || "",
    media: document.getElementById("media").value || ""
  });

  alert("Event added ✅");
}


// 📡 LOAD EVENTS
db.ref("events").on("value", snap => {
  const data = snap.val() || {};
  const box = document.getElementById("events");

  box.innerHTML = "";

  Object.keys(data).reverse().forEach(id => {
    const e = data[id];

    box.innerHTML += `
      <div class="event">
        ${e.image ? `<img src="${e.image}">` : ""}

        <div class="event-content">
          <h3>${e.name}</h3>
          <p>📅 ${e.date}</p>

          <div class="links">
            ${e.meeting ? `<a class="meeting" href="${e.meeting}" target="_blank">اجتماع</a>` : ""}
            ${e.attendance ? `<a class="attendance" href="${e.attendance}" target="_blank">حضور</a>` : ""}
            ${e.media ? `<a class="media" href="${e.media}" target="_blank">فيديو</a>` : ""}
          </div>
        </div>
      </div>
    `;
  });
});

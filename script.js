// 🔥 Firebase config (PUT YOUR OWN)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_DB.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();


// 🔐 ADMIN LOGIN
function openLogin(){
  const email = prompt("Email");
  const pass = prompt("Password");

  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(err.message));
}


// 👀 SHOW ADMIN PANEL
auth.onAuthStateChanged(user=>{
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

  alert("Event added");
}


// 🗑 DELETE EVENT
function deleteEvent(id){
  db.ref("events/" + id).remove();
}


// 📡 LOAD EVENTS
db.ref("events").on("value", snap=>{
  const data = snap.val() || {};
  const box = document.getElementById("events");
  box.innerHTML = "";

  Object.keys(data).reverse().forEach(id=>{
    const e = data[id];
    const isAdmin = auth.currentUser;

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

          ${isAdmin ? `<button class="delete" onclick="deleteEvent('${id}')">حذف</button>` : ""}
        </div>
      </div>
    `;
  });
});

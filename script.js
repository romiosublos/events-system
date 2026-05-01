// 🔥 Firebase Config (YOUR PROJECT)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alghad-nursery"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();


// 🔐 SECRET ADMIN LOGIN (CTRL + SHIFT + A)
document.addEventListener("keydown", (e)=>{
  if(e.ctrlKey && e.shiftKey && e.key === "A"){
    const email = prompt("Admin Email");
    const pass = prompt("Password");

    auth.signInWithEmailAndPassword(email, pass)
      .catch(err => alert(err.message));
  }
});


// 🚪 AUTH STATE
auth.onAuthStateChanged(user=>{
  document.getElementById("adminPanel").style.display = user ? "block" : "none";
});


// ➕ ADD EVENT
function addEvent(){
  db.ref("events").push({
    name: name.value,
    date: date.value,
    image: image.value,
    meeting: meeting.value,
    attendance: attendance.value,
    media: media.value
  });

  alert("Event Added!");
}


// 🗑 DELETE
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

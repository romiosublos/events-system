const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alghad-nursery"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let editId = null;

//
// 🔐 LOGIN
//
function login(){
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(()=> {
      document.getElementById("loginBox").style.display="none";
      document.getElementById("adminPanel").style.display="block";
    })
    .catch(err=>alert(err.message));
}

//
// 🚪 LOGOUT
//
function logout(){
  auth.signOut();
  window.location.reload();
}

//
// ================= PUBLIC PAGE =================
//
function loadPublicEvents(){
  db.ref("events").on("value", snap=>{
    const data = snap.val() || {};
    const box = document.getElementById("events");

    box.innerHTML = "";

    Object.keys(data).reverse().forEach(id=>{
      const e = data[id];

      box.innerHTML += `
        <div class="event">
          ${e.image ? `<img src="${e.image}">` : ""}
          <div class="event-content">
            <h3>${e.name}</h3>
            <p>📅 ${e.date}</p>

            <div class="links">
              <a class="meeting" href="${e.meeting}" target="_blank">اجتماع</a>
              <a class="attendance" href="${e.attendance}" target="_blank">حضور</a>
              <a class="media" href="${e.media}" target="_blank">فيديو</a>
            </div>
          </div>
        </div>
      `;
    });
  });
}

//
// ================= ADMIN PAGE =================
//
function loadAdmin(){
  auth.onAuthStateChanged(user=>{
    if(user){
      document.getElementById("adminPanel").style.display="block";
    }
  });

  db.ref("events").on("value", snap=>{
    const data = snap.val() || {};
    const box = document.getElementById("events");

    box.innerHTML = "";

    Object.keys(data).reverse().forEach(id=>{
      const e = data[id];

      box.innerHTML += `
        <div class="event">
          <h3>${e.name}</h3>

          <button onclick='deleteEvent("${id}")'>Delete</button>
        </div>
      `;
    });
  });
}

//
// ➕ SAVE EVENT
//
function saveEvent(){

  if(!document.getElementById("name").value ||
     !document.getElementById("date").value ||
     !document.getElementById("meeting").value ||
     !document.getElementById("attendance").value ||
     !document.getElementById("media").value){
    alert("Fill required fields");
    return;
  }

  db.ref("events").push({
    name: name.value,
    date: date.value,
    image: image.value || "",
    meeting: meeting.value,
    attendance: attendance.value,
    media: media.value
  });

  alert("Saved");
}

//
// 🗑 DELETE
//
function deleteEvent(id){
  db.ref("events/"+id).remove();
}

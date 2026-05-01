// 🔥 Firebase Config
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
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(()=>{
      alert("Login success");
      document.getElementById("loginBox").style.display="none";
    })
    .catch(err=>alert(err.message));
}

//
// 🚪 LOGOUT
//
function logout(){
  auth.signOut();
}

//
// 👀 AUTH STATE
//
auth.onAuthStateChanged(user=>{
  document.getElementById("adminPanel").style.display = user ? "block" : "none";
  document.getElementById("logoutBtn").style.display = user ? "inline-block" : "none";
});

//
// ➕ SAVE (ADD / EDIT)
//
function saveEvent(){

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const image = document.getElementById("image").value;

  const meeting = document.getElementById("meeting").value;
  const attendance = document.getElementById("attendance").value;
  const media = document.getElementById("media").value;

  // ✅ VALIDATION
  if(!name || !date || !meeting || !attendance || !media){
    alert("Please fill all required fields");
    return;
  }

  const data = {
    name,
    date,
    image: image || "",
    meeting,
    attendance,
    media
  };

  if(editId){
    db.ref("events/"+editId).update(data);
    editId = null;
    alert("Updated ✅");
  }else{
    db.ref("events").push(data);
    alert("Added ✅");
  }

  clearForm();
}

//
// 🧹 CLEAR FORM
//
function clearForm(){
  document.querySelectorAll("input").forEach(i=>i.value="");
}

//
// 🗑 DELETE
//
function deleteEvent(id){
  if(confirm("Delete event?")){
    db.ref("events/"+id).remove();
  }
}

//
// ✏️ EDIT
//
function editEvent(id, data){
  editId = id;

  document.getElementById("name").value = data.name;
  document.getElementById("date").value = data.date;
  document.getElementById("image").value = data.image || "";
  document.getElementById("meeting").value = data.meeting;
  document.getElementById("attendance").value = data.attendance;
  document.getElementById("media").value = data.media;

  window.scrollTo(0,0);
}

//
// 📡 LOAD EVENTS
//
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
            <a class="meeting" href="${e.meeting}" target="_blank">اجتماع</a>
            <a class="attendance" href="${e.attendance}" target="_blank">حضور</a>
            <a class="media" href="${e.media}" target="_blank">فيديو</a>
          </div>

          ${isAdmin ? `
            <button onclick='editEvent("${id}", ${JSON.stringify(e)})'>✏️ Edit</button>
            <button onclick='deleteEvent("${id}")'>🗑 Delete</button>
          ` : ""}
        </div>
      </div>
    `;
  });
});

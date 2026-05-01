const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let editId = null;

//
// LOGIN
//
function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(()=>{
      loginBox.style.display="none";
      adminPanel.style.display="block";
    })
    .catch(e=>alert(e.message));
}

//
// LOGOUT
//
function logout(){
  auth.signOut();
  location.reload();
}

//
// SAVE / EDIT
//
function addEvent(){

  if(!name.value || !date.value || !meeting.value || !attendance.value || !media.value){
    alert("Fill required fields");
    return;
  }

  const data = {
    name:name.value,
    date:date.value,
    image:image.value || "",
    meeting:meeting.value,
    attendance:attendance.value,
    media:media.value
  };

  if(editId){
    db.ref("events/"+editId).update(data);
    editId=null;
  }else{
    db.ref("events").push(data);
  }

  clear();
}

function clear(){
  document.querySelectorAll("input").forEach(i=>i.value="");
}

//
// DELETE
//
function deleteEvent(id){
  db.ref("events/"+id).remove();
}

//
// EDIT
//
function editEvent(id,data){
  editId=id;

  name.value=data.name;
  date.value=data.date;
  image.value=data.image;
  meeting.value=data.meeting;
  attendance.value=data.attendance;
  media.value=data.media;
}

//
// LOAD EVENTS
//
db.ref("events").on("value", snap=>{
  const data = snap.val() || {};
  const box = document.getElementById("events");

  box.innerHTML="";

  Object.keys(data).reverse().forEach(id=>{
    const e=data[id];

    box.innerHTML+=`
      <div class="event">
        <h3>${e.name}</h3>
        <p>${e.date}</p>

        <button onclick='editEvent("${id}", ${JSON.stringify(e)})'>Edit</button>
        <button onclick='deleteEvent("${id}")'>Delete</button>
      </div>
    `;
  });
});

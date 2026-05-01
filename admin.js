const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let editId = null;
let currentUser = null;

// Monitor authentication state
auth.onAuthStateChanged(user => {
  currentUser = user;
  
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
    loadAdminEvents();
  } else {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

//
// LOGIN HANDLER
//
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      showNotification("تم تسجيل الدخول بنجاح ✓", "success");
    })
    .catch(err => {
      showNotification("خطأ: " + err.message, "error");
    });
}

//
// LOGOUT HANDLER
//
function logout(){
  auth.signOut();
  clearForm();
  showNotification("تم تسجيل الخروج بنجاح", "info");
}

//
// ADD EVENT HANDLER
//
function handleAddEvent(event) {
  event.preventDefault();
  addEvent();
}

//
// SAVE / EDIT EVENT
//
function addEvent(){
  // ✅ CHECK IF USER IS LOGGED IN
  if (!currentUser) {
    showNotification("يجب تسجيل الدخول لإضافة فعالية", "error");
    return;
  }

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const image = document.getElementById("image").value;
  const meeting = document.getElementById("meeting").value;
  const attendance = document.getElementById("attendance").value;
  const media = document.getElementById("media").value;

  if(!name || !date || !meeting || !attendance || !media){
    showNotification("يرجى ملء جميع الحقول المطلوبة", "error");
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
    db.ref("events/"+editId).update(data)
      .then(() => {
        editId = null;
        clearForm();
        showNotification("تم تحديث الفعالية بنجاح ✓", "success");
      })
      .catch(err => showNotification("خطأ: " + err.message, "error"));
  } else {
    db.ref("events").push(data)
      .then(() => {
        clearForm();
        showNotification("تم إضافة الفعالية بنجاح ✓", "success");
      })
      .catch(err => showNotification("خطأ: " + err.message, "error"));
  }
}

function clearForm(){
  document.getElementById("name").value = "";
  document.getElementById("date").value = "";
  document.getElementById("image").value = "";
  document.getElementById("meeting").value = "";
  document.getElementById("attendance").value = "";
  document.getElementById("media").value = "";
  editId = null;
}

//
// DELETE EVENT
//
function deleteEvent(id){
  // ✅ CHECK IF USER IS LOGGED IN BEFORE DELETING
  if (!currentUser) {
    showNotification("يجب تسجيل الدخول للحذف", "error");
    return;
  }
  
  if (confirm("هل أنت متأكد من حذف هذه الفعالية؟")) {
    db.ref("events/"+id).remove()
      .then(() => showNotification("تم حذف الفعالية بنجاح ✓", "success"))
      .catch(err => showNotification("خطأ: " + err.message, "error"));
  }
}

//
// EDIT EVENT
//
function editEvent(id, data){
  // ✅ CHECK IF USER IS LOGGED IN BEFORE EDITING
  if (!currentUser) {
    showNotification("يجب تسجيل الدخول للتعديل", "error");
    return;
  }
  
  editId = id;
  document.getElementById("name").value = data.name;
  document.getElementById("date").value = data.date;
  document.getElementById("image").value = data.image;
  document.getElementById("meeting").value = data.meeting;
  document.getElementById("attendance").value = data.attendance;
  document.getElementById("media").value = data.media;
  
  // Scroll to form
  document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
}

//
// LOAD ADMIN EVENTS
//
function loadAdminEvents(){
  db.ref("events").on("value", snap=>{
    const data = snap.val() || {};
    const box = document.getElementById("events");

    box.innerHTML = "";

    if (Object.keys(data).length === 0) {
      box.innerHTML = '<div style="text-align: center; padding: 2rem; color: #64748b;">لا توجد فعاليات حالياً</div>';
      return;
    }

    Object.keys(data).reverse().forEach(id=>{
      const e = data[id];

      box.innerHTML += `
        <div class="event-item">
          <div class="event-item-info">
            <h3>${e.name}</h3>
            <p>📅 ${new Date(e.date).toLocaleDateString('ar-SA')}</p>
          </div>
          <div class="event-item-actions">
            <button onclick='editEvent("${id}", ${JSON.stringify(e)})' class="btn btn-primary" title="تعديل">✏️ تعديل</button>
            <button onclick='deleteEvent("${id}")' class="btn btn-danger" title="حذف">🗑️ حذف</button>
          </div>
        </div>
      `;
    });
  });
}

//
// NOTIFICATION SYSTEM
//
function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `;

  if (type === "success") {
    notif.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    notif.style.color = "white";
  } else if (type === "error") {
    notif.style.background = "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    notif.style.color = "white";
  } else {
    notif.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)";
    notif.style.color = "white";
  }

  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Add slide animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
let hasEvents = false;

db.ref("events").on("value", snap=>{
  const data = snap.val() || {};
  const box = document.getElementById("events");
  const emptyState = document.getElementById("empty-state");

  box.innerHTML = "";
  hasEvents = Object.keys(data).length > 0;

  if (!hasEvents) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  Object.keys(data).reverse().forEach(id=>{
    const e = data[id];

    // Format date
    const eventDate = new Date(e.date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    box.innerHTML += `
      <div class="event">
        ${e.image ? `<img src="${e.image}" alt="${e.name}" onerror="this.style.display='none'">` : ""}

        <div class="event-content">
          <h3>${e.name}</h3>
          <p>📅 ${eventDate}</p>

          <div class="links">
            <a class="meeting" href="${e.meeting}" target="_blank" rel="noopener noreferrer">
              📞 اجتماع
            </a>
            <a class="attendance" href="${e.attendance}" target="_blank" rel="noopener noreferrer">
              ✅ حضور
            </a>
            <a class="media" href="${e.media}" target="_blank" rel="noopener noreferrer">
              🎥 فيديو
            </a>
          </div>
        </div>
      </div>
    `;
  });
});

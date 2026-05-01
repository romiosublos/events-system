const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

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

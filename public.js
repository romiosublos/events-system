const firebaseConfig = {
  apiKey: "AIzaSyC6GsAITxmH0uSYBV474lA4U14g2UtwB3A",
  authDomain: "alghad-nursery.firebaseapp.com",
  databaseURL: "https://alghad-nursery-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
let allEvents = {};

// Load likes from localStorage
function getLikesFromStorage() {
  const likes = localStorage.getItem('eventLikes');
  return likes ? JSON.parse(likes) : {};
}

// Save likes to localStorage
function saveLikesToStorage(likes) {
  localStorage.setItem('eventLikes', JSON.stringify(likes));
}

// Toggle like for an event
function toggleLike(eventId) {
  let likes = getLikesFromStorage();
  
  if (!likes[eventId]) {
    likes[eventId] = 0;
  }
  
  // Toggle like state
  const likeBtn = document.querySelector(`[data-like-btn="${eventId}"]`);
  if (likeBtn.classList.contains('liked')) {
    likeBtn.classList.remove('liked');
    likes[eventId]--;
  } else {
    likeBtn.classList.add('liked');
    likes[eventId]++;
  }
  
  // Update count
  const countElement = document.querySelector(`[data-like-count="${eventId}"]`);
  countElement.textContent = likes[eventId];
  
  // Save to localStorage
  saveLikesToStorage(likes);
}

// Load all events from Firebase
db.ref("events").on("value", snap => {
  const data = snap.val() || {};
  allEvents = data;
  filterAndSortEvents();
});

// Filter and sort events
function filterAndSortEvents() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortOption = document.getElementById("sortSelect").value;
  
  let filteredEvents = {};
  
  // Filter by search term
  Object.keys(allEvents).forEach(id => {
    const event = allEvents[id];
    if (event.name.toLowerCase().includes(searchTerm)) {
      filteredEvents[id] = event;
    }
  });
  
  // Sort events
  let sortedIds = Object.keys(filteredEvents);
  
  if (sortOption === "newest") {
    sortedIds.sort((a, b) => {
      return new Date(filteredEvents[b].date) - new Date(filteredEvents[a].date);
    });
  } else if (sortOption === "oldest") {
    sortedIds.sort((a, b) => {
      return new Date(filteredEvents[a].date) - new Date(filteredEvents[b].date);
    });
  }
  
  // Display filtered and sorted events
  displayEvents(filteredEvents, sortedIds);
}

// Display events
function displayEvents(events, sortedIds) {
  const box = document.getElementById("events");
  const emptyState = document.getElementById("empty-state");
  
  box.innerHTML = "";
  
  if (sortedIds.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  
  emptyState.style.display = "none";
  
  const likes = getLikesFromStorage();
  
  sortedIds.reverse().forEach(id => {
    const e = events[id];
    
    // Format date in Arabic
    const eventDate = new Date(e.date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get like count
    const likeCount = likes[id] || 0;
    const isLiked = likes[id] ? 'liked' : '';
    
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
          
          <div class="event-footer">
            <button class="like-btn ${isLiked}" data-like-btn="${id}" onclick="toggleLike('${id}')">
              ❤️ أعجبني
            </button>
            <div class="like-count" data-like-count="${id}">
              ${likeCount} ❤️
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

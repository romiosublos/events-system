let events = JSON.parse(localStorage.getItem("events") || "[]");

function save(){
  localStorage.setItem("events", JSON.stringify(events));
}

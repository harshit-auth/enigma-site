fetch("/api/events")
  .then(res => res.json())
  .then(events => {
    const list = document.getElementById("events");
    events.forEach(e => {
      const li = document.createElement("li");
      li.textContent = e.title + " - " + e.date;
      list.appendChild(li);
    });
  });
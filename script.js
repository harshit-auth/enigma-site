// Load events from the backend
fetch("/api/events")
  .then((res) => res.json())
  .then((events) => {
    const list = document.getElementById("events-list");
    list.innerHTML = "";
    events.forEach((e) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${e.title}</h3><p class="event-date">${e.date}</p>`;
      list.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("events-list").innerHTML =
      '<p class="muted">Could not load events right now.</p>';
  });

// Contact form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "status";
  status.textContent = "Sending...";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
      }),
    });

    if (res.ok) {
      status.textContent = "Thanks! Your message has been sent.";
      status.className = "status ok";
      form.reset();
    } else {
      status.textContent = "Please fill in all fields.";
      status.className = "status err";
    }
  } catch {
    status.textContent = "Something went wrong. Try again.";
    status.className = "status err";
  }
});

// Fade in sections on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

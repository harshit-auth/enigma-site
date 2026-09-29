/* =========================================================
   ENIGMA // FRONTEND CONTROLLER
   ========================================================= */


/* =========================
   01. LOAD EVENTS
   ========================= */

async function loadEvents() {
  const list = document.getElementById("events-list");

  if (!list) return;

  try {
    const response = await fetch("/api/events");

    if (!response.ok) {
      throw new Error("Failed to load events");
    }

    const events = await response.json();

    list.innerHTML = "";

    if (!Array.isArray(events) || events.length === 0) {
      list.innerHTML = `
        <div class="loading-state">
          NO ACTIVE MISSIONS FOUND.
        </div>
      `;
      return;
    }

    events.forEach((event) => {
      const card = document.createElement("article");

      card.className = "card";

      card.innerHTML = `
        <div>
          <h3>${escapeHTML(event.title)}</h3>
          <p class="event-date">&gt; ${escapeHTML(event.date)}</p>
        </div>
      `;

      list.appendChild(card);
    });

  } catch (error) {
    console.error("Event loading error:", error);

    list.innerHTML = `
      <div class="loading-state">
        UNABLE TO CONNECT TO MISSION.LOG
      </div>
    `;
  }
}


/* =========================
   02. BASIC HTML ESCAPING
   ========================= */

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}


/* =========================
   03. CONTACT FORM
   ========================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {

  contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "ERROR // ALL FIELDS ARE REQUIRED.";
      return;
    }

    formStatus.textContent = "TRANSMITTING...";

    try {

      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transmission failed");
      }

      formStatus.textContent =
        "TRANSMISSION RECEIVED // CHANNEL SECURE.";

      contactForm.reset();

    } catch (error) {

      console.error("Contact form error:", error);

      formStatus.textContent =
        "ERROR // TRANSMISSION FAILED.";
    }

  });

}


/* =========================
   04. SCROLL REVEAL
   ========================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


/* =========================
   05. ACTIVE NAVIGATION
   ========================= */

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".navbar nav a");

const navObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) return;

      const id = entry.target.id;

      navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });

    });

  },
  {
    rootMargin: "-35% 0px -55% 0px"
  }
);

sections.forEach((section) => {
  navObserver.observe(section);
});


/* =========================
   06. SCROLL PROGRESS
   ========================= */

const progress = document.getElementById("progress");

function updateProgress() {

  if (!progress) return;

  const scrollTop = window.scrollY;

  const documentHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  if (documentHeight <= 0) {
    progress.style.width = "0%";
    return;
  }

  const percentage =
    (scrollTop / documentHeight) * 100;

  progress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

updateProgress();


/* =========================
   07. START APPLICATION
   ========================= */

loadEvents();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Load events from the backend ----------
fetch("/api/events")
  .then((res) => res.json())
  .then((events) => {
    const list = document.getElementById("events-list");
    list.innerHTML = "";
    events.forEach((e) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h3>${e.title}</h3><p class="event-date">&gt; ${e.date}</p>`;
      list.appendChild(card);
    });
  })
  .catch(() => {
    document.getElementById("events-list").innerHTML =
      '<p class="muted">Could not load events right now.</p>';
  });

// ---------- Contact form ----------
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

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("visible")),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Active nav link ----------
const navLinks = document.querySelectorAll("#nav a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Scroll progress bar ----------
const progress = document.getElementById("progress");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
});

// ---------- Typing effect ----------
const phrases = [
  "build things that matter",
  "learn by doing",
  "break it, fix it, ship it",
  "solve problems together",
];
const typedEl = document.getElementById("typed");
let pi = 0, ci = 0, deleting = false;

function typeLoop() {
  const word = phrases[pi];
  typedEl.textContent = word.slice(0, ci);

  if (!deleting && ci < word.length) {
    ci++;
    setTimeout(typeLoop, 70);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1400);
  } else if (ci > 0) {
    ci--;
    setTimeout(typeLoop, 35);
  } else {
    deleting = false;
    pi = (pi + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}
if (reduceMotion) typedEl.textContent = phrases[0];
else typeLoop();

// ---------- Mouse: cursor glow + card tilt ----------
const glow = document.getElementById("cursor-glow");
const mouse = { x: null, y: null };
let lastCard = null;

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

  const card = e.target.closest ? e.target.closest(".card") : null;
  if (lastCard && lastCard !== card) lastCard.style.transform = "";

  if (card) {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    if (!reduceMotion) {
      const rx = (y / r.height - 0.5) * -10;
      const ry = (x / r.width - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  }
  lastCard = card;
});

document.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
  if (lastCard) lastCard.style.transform = "";
});

// ---------- Particle network background ----------
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let w, h, particles = [];

function initParticles() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const count = Math.min(90, Math.floor((w * h) / 16000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.35 * (1 - d / 120)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < 160) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * (1 - d / 160)})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

initParticles();
window.addEventListener("resize", initParticles);
if (!reduceMotion) drawParticles();

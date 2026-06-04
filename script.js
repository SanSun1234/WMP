const countdown = document.querySelector("[data-countdown]");
const progress = document.querySelector(".progress");
const rsvpForm = document.querySelector("[data-rsvp-form]");
const musicToggle = document.querySelector("[data-music-toggle]");
const calendarButton = document.querySelector("[data-calendar]");

const weddingDate = new Date("2026-09-05T15:30:00+03:00");

function updateCountdown() {
  if (!countdown) return;

  const now = new Date();
  const difference = Math.max(weddingDate.getTime() - now.getTime(), 0);
  const seconds = Math.floor(difference / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const restSeconds = seconds % 60;

  countdown.querySelector("[data-days]").textContent = days;
  countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
  countdown.querySelector("[data-seconds]").textContent = String(restSeconds).padStart(2, "0");
}

function updateProgress() {
  if (!progress) return;

  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${percent}%`;
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function createPetal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${8 + Math.random() * 8}s`;
  petal.style.setProperty("--drift", `${Math.random() * 140 - 70}px`);
  document.body.appendChild(petal);

  window.setTimeout(() => petal.remove(), 17000);
}

function downloadCalendarFile() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mikhail Polina Wedding//RU",
    "BEGIN:VEVENT",
    "UID:mikhail-polina-wedding-20260905",
    "DTSTAMP:20260604T080000Z",
    "DTSTART:20260905T123000Z",
    "DTEND:20260905T200000Z",
    "SUMMARY:Свадьба Михаила и Полины",
    "LOCATION:Ресторан Чабарок",
    "DESCRIPTION:Приглашение на свадьбу Михаила и Полины",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mikhail-polina-wedding.ics";
  link.click();
  URL.revokeObjectURL(url);
}

rsvpForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const success = rsvpForm.querySelector(".form-success");
  const formData = Object.fromEntries(new FormData(rsvpForm).entries());
  localStorage.setItem("mikhail-polina-rsvp", JSON.stringify(formData));

  if (success) {
    success.hidden = false;
    success.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 450, easing: "ease-out" }
    );
  }
});

musicToggle?.addEventListener("click", () => {
  const isActive = musicToggle.getAttribute("aria-pressed") === "true";
  musicToggle.setAttribute("aria-pressed", String(!isActive));
  musicToggle.textContent = isActive ? "Музыка: выкл" : "Музыка: вкл";
});

calendarButton?.addEventListener("click", downloadCalendarFile);

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

updateCountdown();
updateProgress();
window.setInterval(updateCountdown, 1000);
window.setInterval(createPetal, 2400);

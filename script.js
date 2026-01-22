// ── Thèmes ───────────────────────────────────────────────
const moodButtons = document.querySelectorAll(".mood-btn");

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    moodButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.documentElement.setAttribute("data-theme", btn.dataset.theme);
  });
});

// ── To-Do ─────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("itsyou-tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const isDone = task.done ? "completed" : "";

    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span>${task.text}</span>
      <button class="delete-btn" data-index="${index}">×</button>
    `;

    li.querySelector("input").addEventListener("change", (e) => {
      tasks[index].done = e.target.checked;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    if (task.done) li.classList.add("completed");
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("itsyou-tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

renderTasks();

// ── Notes ─────────────────────────────────────────────────
const notesInput = document.getElementById("notesInput");
const saveNotesBtn = document.getElementById("saveNotesBtn");

notesInput.value = localStorage.getItem("itsyou-notes") || "";

saveNotesBtn.addEventListener("click", () => {
  localStorage.setItem("itsyou-notes", notesInput.value);
  saveNotesBtn.textContent = "Sauvegardé ✓";
  setTimeout(() => (saveNotesBtn.textContent = "Sauvegarder"), 1800);
});

// ── Citations ─────────────────────────────────────────────
const quotes = [
  "Chaque pas compte, même les plus petits.",
  "Tu es plus fort que tes excuses d’hier.",
  "La constance bat le talent quand le talent ne travaille pas.",
  "Respire. Tu es exactement là où tu dois être.",
  "Le progrès silencieux est le plus puissant.",
  "Commence avant d’être prêt. C’est comme ça qu’on grandit.",
  "Un jour difficile ≠ un mauvais parcours.",
  "Ton futur toi te remercie déjà.",
];

document.getElementById("newQuoteBtn").addEventListener("click", () => {
  const quoteEl = document.getElementById("quoteText");
  quoteEl.style.opacity = "0";
  setTimeout(() => {
    quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.style.opacity = "1";
  }, 300);
});

// ── Timer ─────────────────────────────────────────────────
let timerTime = 0;
let timerRunning = false;
let timerInterval = null;

const display = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startTimerBtn");
const pauseBtn = document.getElementById("pauseTimerBtn");
const resetBtn = document.getElementById("resetTimerBtn");

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function updateButtons() {
  startBtn.disabled = timerRunning;
  pauseBtn.disabled = !timerRunning;
  resetBtn.disabled = timerTime === 0 && !timerRunning;
}

document.querySelectorAll(".time-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".time-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    timerTime = parseInt(btn.dataset.time);
    display.textContent = formatTime(timerTime);
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    }
    updateButtons();
  });
});

startBtn.addEventListener("click", () => {
  if (timerTime <= 0) return;
  timerRunning = true;
  updateButtons();

  timerInterval = setInterval(() => {
    timerTime--;
    display.textContent = formatTime(timerTime);

    if (timerTime <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      alert("Temps écoulé ! Prends une vraie pause.");
      updateButtons();
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  updateButtons();
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerTime = 0;
  timerRunning = false;
  display.textContent = "00:00";
  document
    .querySelectorAll(".time-btn")
    .forEach((b) => b.classList.remove("active"));
  updateButtons();
});

// ── Déconnexion ───────────────────────────────────────────
document.getElementById("disconnectBtn").addEventListener("click", () => {
  document.body.innerHTML = `
    <div style="height:100dvh;display:flex;justify-content:center;align-items:center;background:#000;color:#fff;text-align:center;padding:20px;">
      <div>
        <h1 style="font-size:3.5rem;margin-bottom:1.5rem;">À tout à l’heure</h1>
        <p style="font-size:1.4rem;margin-bottom:2.5rem;opacity:0.9;">
          Respire profondément.<br>Reviens quand tu te sens prêt.
        </p>
        <button onclick="location.reload()" style="padding:16px 40px;background:var(--accent);color:white;border:none;border-radius:999px;font-size:1.2rem;font-weight:600;cursor:pointer;">
          Revenir à ItsU
        </button>
      </div>
    </div>
  `;
});

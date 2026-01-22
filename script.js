// Thèmes + détection dark mode système
const moodButtons = document.querySelectorAll('.mood-btn');

moodButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    moodButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.setAttribute('data-theme', btn.dataset.theme);
  });
});

// To-Do amélioré
let tasks = JSON.parse(localStorage.getItem('itsyou-tasks')) || [];

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskStats = document.getElementById('taskStats');
const clearAllTasks = document.getElementById('clearAllTasks');

function renderTasks() {
  taskList.innerHTML = '';
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  taskStats.textContent = `${done} / ${total} terminées`;

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="delete-btn" data-index="${index}">×</button>
    `;

    li.querySelector('input').addEventListener('change', e => {
      tasks[index].done = e.target.checked;
      saveTasks();
      renderTasks();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    if (task.done) li.classList.add('completed');

    taskList.appendChild(li);
    setTimeout(() => li.classList.add('appear'), 50 + index * 60);
  });
}

function saveTasks() {
  localStorage.setItem('itsyou-tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addNewTask(); });

function addNewTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

clearAllTasks.addEventListener('click', () => {
  if (!tasks.length) return;
  if (confirm("Vraiment tout supprimer ? Cette action est irréversible.")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

renderTasks();

// Notes + auto-save + compteur
const notesInput = document.getElementById('notesInput');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const wordCount = document.getElementById('wordCount');

notesInput.value = localStorage.getItem('itsyou-notes') || '';

function updateWordCount() {
  const words = notesInput.value.trim().split(/\s+/).filter(w => w).length;
  wordCount.textContent = words + (words === 1 ? ' mot' : ' mots');
}

notesInput.addEventListener('input', updateWordCount);

saveNotesBtn.addEventListener('click', () => {
  localStorage.setItem('itsyou-notes', notesInput.value);
  saveNotesBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sauvegardé';
  setTimeout(() => saveNotesBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Sauvegarder', 2000);
});

setInterval(() => {
  localStorage.setItem('itsyou-notes', notesInput.value);
}, 8000);

updateWordCount();

// Citations + auto-change
const quotes = [ /* même liste que précédemment */ ];
let autoQuoteInterval;

const quoteText = document.getElementById('quoteText');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const autoQuoteToggle = document.getElementById('autoQuote');

function showRandomQuote() {
  quoteText.style.opacity = '0';
  setTimeout(() => {
    quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.style.opacity = '1';
  }, 400);
}

newQuoteBtn.addEventListener('click', showRandomQuote);

autoQuoteToggle.addEventListener('change', () => {
  if (autoQuoteToggle.checked) {
    autoQuoteInterval = setInterval(showRandomQuote, 45000);
  } else {
    clearInterval(autoQuoteInterval);
  }
});

// Lancer auto au démarrage si coché
if (autoQuoteToggle.checked) {
  autoQuoteInterval = setInterval(showRandomQuote, 45000);
  showRandomQuote(); // première citation immédiate
}

// Timer avec pulse low-time
let timerTime = 0;
let timerRunning = false;
let timerInterval = null;

const display = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startTimerBtn');
const pauseBtn = document.getElementById('pauseTimerBtn');
const resetBtn = document.getElementById('resetTimerBtn');

function formatTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

function updateButtons() {
  startBtn.disabled = timerRunning;
  pauseBtn.disabled = !timerRunning;
  resetBtn.disabled = timerTime === 0 && !timerRunning;
}

document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timerTime = parseInt(btn.dataset.time);
    display.textContent = formatTime(timerTime);
    display.classList.remove('low-time');
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    }
    updateButtons();
  });
});

startBtn.addEventListener('click', () => {
  if (timerTime <= 0) return;
  timerRunning = true;
  updateButtons();

  timerInterval = setInterval(() => {
    timerTime--;
    display.textContent = formatTime(timerTime);

    if (timerTime <= 60) {
      display.classList.add('low-time');
    } else {
      display.classList.remove('low-time');
    }

    if (timerTime <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      display.classList.remove('low-time');
      alert("Temps écoulé. Prends une vraie pause.");
      updateButtons();
    }
  }, 1000);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  display.classList.remove('low-time');
  updateButtons();
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerTime = 0;
  timerRunning = false;
  display.textContent = '00:00';
  display.classList.remove('low-time');
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
  updateButtons();
});

// Déconnexion – son très calme (vagues + vent léger)
document.getElementById('disconnectBtn').addEventListener('click', () => {
  const calmSound = new Audio('https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3'); // vagues calmes + vent très doux
  calmSound.loop = true;
  calmSound.volume = 0.18;

  document.body.innerHTML = `
    <div class="disconnect-screen">
      <div class="content">
        <h1>Respire</h1>
        <p>Le temps s’arrête ici.<br>Laisse ton esprit flotter.</p>
        
        <div class="ambient-player">
          <button id="playAmbient" class="play-btn">Jouer le calme ♪</button>
        </div>

        <button onclick="location.reload()" class="return-btn">
          Revenir quand je suis prêt
        </button>
      </div>
    </div>
  `;

  document.getElementById('playAmbient')?.addEventListener('click', () => {
    if (calmSound.paused) {
      calmSound.play().catch(e => console.log("Lecture bloquée:", e));
      document.querySelector('.play-btn').textContent = "Pause le calme ♪";
    } else {
      calmSound.pause();
      document.querySelector('.play-btn').textContent = "Jouer le calme ♪";
    }
  });
});
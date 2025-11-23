const timerForm = document.getElementById('timerForm');
const timersList = document.getElementById('timersList');
const errorMsg = document.getElementById('errorMsg');
const alarmSound = document.getElementById('alarmSound');

let timers = [];
let timerId = 1;

// Helper to pad numbers
function pad(num) {
  return num.toString().padStart(2, '0');
}

// Render all active timers
function renderTimers() {
  timersList.innerHTML = '';
  if (timers.length === 0) {
    timersList.innerHTML = `<p class="no-timer-msg">You have no timers currently!</p>`;
    return;
  }
  timers.forEach(timer => {
    const div = document.createElement('div');
    div.className = timer.ended ? 'timer timer-ended' : 'timer';
    let timeText = timer.ended ? 'Timer Is Up !' : `Time Left: ${pad(timer.hours)} : ${pad(timer.minutes)} : ${pad(timer.seconds)}`;
    div.innerHTML = `<span>${timeText}</span>`;
    // Button for end or delete
    const btn = document.createElement('button');
    if (timer.ended) {
      btn.textContent = 'Stop';
      btn.onclick = () => removeTimer(timer.id);
    } else {
      btn.textContent = 'Delete';
      btn.onclick = () => removeTimer(timer.id);
    }
    div.appendChild(btn);
    timersList.appendChild(div);
  });
}

// Remove timer by id
function removeTimer(id) {
  const idx = timers.findIndex(t => t.id === id);
  if (idx !== -1) {
    clearInterval(timers[idx].interval);
    timers.splice(idx, 1);
    renderTimers();
  }
}

// Decrement function
function tickTimer(timer) {
  if (timer.seconds > 0) {
    timer.seconds--;
  } else if (timer.minutes > 0) {
    timer.minutes--;
    timer.seconds = 59;
  } else if (timer.hours > 0) {
    timer.hours--;
    timer.minutes = 59;
    timer.seconds = 59;
  } else {
    timer.ended = true;
    clearInterval(timer.interval);
    renderTimers();
    alarmSound.play();
    return;
  }
  renderTimers();
}

// Form submission
timerForm.addEventListener('submit', function(e) {
  e.preventDefault();
  errorMsg.textContent = '';
  let hours = +timerForm.hours.value;
  let minutes = +timerForm.minutes.value;
  let seconds = +timerForm.seconds.value;

  if (
    (isNaN(hours) && isNaN(minutes) && isNaN(seconds)) ||
    (hours === 0 && minutes === 0 && seconds === 0)
  ) {
    errorMsg.textContent = 'Please enter a valid time!';
    return;
  }

  // Limit values
  hours = Math.max(0, Math.min(99, hours));
  minutes = Math.max(0, Math.min(59, minutes));
  seconds = Math.max(0, Math.min(59, seconds));

  const newTimer = {
    id: timerId++,
    hours,
    minutes,
    seconds,
    ended: false,
    interval: null
  };

  newTimer.interval = setInterval(() => tickTimer(newTimer), 1000);
  timers.push(newTimer);

  renderTimers();

  timerForm.reset();
});

// Initial render
renderTimers();

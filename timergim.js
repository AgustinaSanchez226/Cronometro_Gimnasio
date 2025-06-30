const formTimer = document.querySelector("#timer");
const setting = document.querySelector("#timer > fieldset");
const outTime = document.querySelector("#time");
const inputMin = document.querySelector("#minutos");
const inputSec = document.querySelector("#segundos");
const inputPrecount = document.getElementById("precount");
const btnStart = document.querySelector("#start");
const btnStop = document.querySelector("#stop");
const btnResume = document.getElementById("resume");
const inputsTimer = document.getElementById("inputs-timer");
let time = 0;
let intervalo = null;
let isPaused = false;

function updateButtons() {
  if (isPaused && time > 0) {
    btnStart.style.display = "none";
    btnResume.style.display = "inline-block";
    btnStop.style.display = "inline-block";
  } else if (intervalo) {
    btnStart.style.display = "none";
    btnResume.style.display = "none";
    btnStop.style.display = "inline-block";
  } else if (time > 0 && !intervalo && !isPaused) {
    btnStart.style.display = "none";
    btnResume.style.display = "inline-block";
    btnStop.style.display = "inline-block";
  } else {
    btnStart.style.display = "inline-block";
    btnResume.style.display = "none";
    btnStop.style.display = "inline-block";
  }
}

function startInterval() {
  if (intervalo) clearInterval(intervalo);
  outTime.classList.add("big-numbers");
  intervalo = setInterval(() => {
    if (time <= 0) {
      clearInterval(intervalo);
      intervalo = null;
      outTime.innerHTML = `00:00`;
      outTime.classList.remove("big-numbers");
      isPaused = false;
      updateButtons();
      return;
    }
    let mins = Math.floor(time / 60000);
    let secs = Math.floor((time % 60000) / 1000);
    let template = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    outTime.innerHTML = template;
    time -= 1000;
  }, 1000);
  updateButtons();
}

btnStart.addEventListener("click", () => {
  isPaused = false;
  btnStart.style.display = "none";
  btnStop.style.display = "none";
  btnResume.style.display = "none";
  let mins = Number(inputMin.value) * 60 * 1000;
  let secs = Number(inputSec.value) * 1000;
  time = mins + secs;
  let precount = Number(inputPrecount.value) || 0;
  setting.classList.remove("active");
  outTime.classList.remove("active");
  outTime.classList.add("active");
  if (setting) {
    setting.classList.add("hide-fieldset");
  }
  outTime.classList.remove("big-numbers");
  if (precount > 0) {
    let preTime = precount;
    outTime.classList.remove("big-numbers");
    outTime.innerHTML = `Prepárate: ${preTime}s`;
    let preInterval = setInterval(() => {
      preTime--;
      outTime.classList.remove("big-numbers");
      if (preTime > 1) {
        outTime.innerHTML = `Prepárate: ${preTime}s`;
      } else if (preTime === 1) {
        outTime.innerHTML = `Prepárate: 1s`;
      } else if (preTime === 0) {
        clearInterval(preInterval);
        outTime.innerHTML = `GO!`;
        outTime.classList.add("big-numbers");
        setTimeout(() => {
          outTime.classList.remove("big-numbers");
          startInterval();
        }, 900);
      }
    }, 1000);
  } else {
    startInterval();
  }
});

btnStop.addEventListener("click", () => {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
    isPaused = true;
    updateButtons();
  } else if (isPaused && time > 0) {
    isPaused = false;
    time = 0;
    outTime.innerHTML = '00:00';
    if (setting) {
      setting.classList.remove('hide-fieldset');
    }
    outTime.classList.remove('big-numbers');
    btnStart.style.display = 'inline-block';
    btnResume.style.display = 'none';
    btnStop.style.display = 'inline-block';
    inputMin.value = '';
    inputSec.value = '';
    inputPrecount.value = '';
  } else {
    isPaused = false;
    updateButtons();
    if (setting) {
      setting.classList.remove('hide-fieldset');
    }
    setting.classList.remove('active');
    outTime.classList.remove('active');
    setting.classList.add('active');
    time = 0;
  }
});

btnResume.addEventListener("click", () => {
  isPaused = false;
  startInterval();
  updateButtons();
});
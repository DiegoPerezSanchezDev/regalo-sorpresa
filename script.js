const CONFIG = {
  destino: "Santander",
  mensajeFinal:
    "Porque no hay mejor regalo que seguir coleccionando momentos contigo. Prep\u00e1rate para mar, paseos bonitos, risas y una escapada de esas que se quedan guardadas para siempre.",
  cuentaAtras: 3
};

const revealButton = document.querySelector("#revealButton");
const introScreen = document.querySelector("#introScreen");
const countdownScreen = document.querySelector("#countdownScreen");
const revealScreen = document.querySelector("#revealScreen");
const countdownNumber = document.querySelector("#countdownNumber");
const destinationName = document.querySelector("#destinationName");
const romanticMessage = document.querySelector("#romanticMessage");
const dateOptions = document.querySelectorAll(".date-option");
const selectedDate = document.querySelector("#selectedDate");
const confettiCanvas = document.querySelector("#confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let confettiPieces = [];
let confettiAnimationId = null;

destinationName.textContent = CONFIG.destino;
romanticMessage.textContent = CONFIG.mensajeFinal;

function showScreen(screen) {
  [introScreen, countdownScreen, revealScreen].forEach((item) => {
    item.classList.toggle("is-active", item === screen);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function startExperience() {
  revealButton.disabled = true;
  showScreen(countdownScreen);

  for (let value = CONFIG.cuentaAtras; value > 0; value -= 1) {
    countdownNumber.textContent = value;
    countdownNumber.classList.remove("pulse");
    void countdownNumber.offsetWidth;
    countdownNumber.classList.add("pulse");
    await wait(900);
  }

  showScreen(revealScreen);
  launchConfetti();
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  confettiCanvas.width = Math.floor(window.innerWidth * ratio);
  confettiCanvas.height = Math.floor(window.innerHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createConfettiPiece() {
  const colors = ["#d84d6a", "#ffffff", "#f3b6c3", "#7ca7bd", "#1f1f23", "#f6d365"];
  return {
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.35,
    size: 7 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2.2 + Math.random() * 4.8,
    drift: -1.4 + Math.random() * 2.8,
    rotation: Math.random() * Math.PI,
    spin: -0.12 + Math.random() * 0.24,
    opacity: 0.74 + Math.random() * 0.26
  };
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.spin;

    ctx.save();
    ctx.globalAlpha = piece.opacity;
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.y < window.innerHeight + 30);

  if (confettiPieces.length > 0) {
    confettiAnimationId = window.requestAnimationFrame(drawConfetti);
  } else {
    confettiAnimationId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function launchConfetti() {
  resizeCanvas();
  confettiPieces = Array.from({ length: 190 }, createConfettiPiece);

  if (confettiAnimationId) {
    window.cancelAnimationFrame(confettiAnimationId);
  }

  drawConfetti();
}

function selectDate(option) {
  dateOptions.forEach((item) => {
    item.classList.toggle("is-selected", item === option);
  });

  selectedDate.textContent = `Elegida: ${option.dataset.date}. Ya solo falta hacer la maleta.`;
  launchConfetti();
}

window.addEventListener("resize", resizeCanvas);
revealButton.addEventListener("click", startExperience);
dateOptions.forEach((option) => {
  option.addEventListener("click", () => selectDate(option));
});
resizeCanvas();

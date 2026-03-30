// PERSONAL DASHBOARD
// Canvas
const clockCnv = document.getElementById("clock");
const clockCtx = clockCnv.getContext("2d");

const drawCnv = document.getElementById("drawing");
const drawCtx = drawCnv.getContext("2d");

// Mouse
let mouseDown = false;
document.addEventListener("mousedown", () => {
  mouseDown = true;
});
document.addEventListener("mouseup", () => {
  mouseDown = false;
});

let [clockMouseX, clockMouseY] = [0, 0];
let [drawMouseX, drawMouseY] = [0, 0];
let lastXY = [];
document.addEventListener("mousemove", (event) => {
  if (
    drawMouseX > 0 &&
    drawMouseY > 0 &&
    drawMouseX < drawCnv.width &&
    drawMouseY < drawCnv.height &&
    mouseDown
  )
    lastXY.push([drawMouseX, drawMouseY]);

  // clock canvas
  const clockRect = clockCnv.getBoundingClientRect();
  const clockScaleX = clockCnv.width / clockRect.width;
  const clockScaleY = clockCnv.height / clockRect.height;
  clockMouseX = (event.clientX - clockRect.left) * clockScaleX;
  clockMouseY = (event.clientY - clockRect.top) * clockScaleY;

  // draw canvas
  const drawRect = drawCnv.getBoundingClientRect();
  const drawScaleX = drawCnv.width / drawRect.width;
  const drawScaleY = drawCnv.height / drawRect.height;
  drawMouseX = (event.clientX - drawRect.left) * drawScaleX;
  drawMouseY = (event.clientY - drawRect.top) * drawScaleY;
});

// Clock
// get the time
let time = new Date();
let seconds = time.getSeconds();
let minutes = time.getMinutes();
let hours = time.getHours();

// calculates second, minute, and hour hand positions
let secondHand = -Math.PI + ((2 * Math.PI) / 60) * seconds;
let minuteHand =
  -Math.PI + ((2 * Math.PI) / 60) * minutes + ((2 * Math.PI) / 3600) * seconds;
let hourHand =
  -Math.PI +
  ((2 * Math.PI) / 12) * hours +
  (Math.PI / 12) * (minutes / 60) +
  (Math.PI / 12) * (seconds / 3600);

let [secondTick, minuteTick, hourTick] = [Date.now(), Date.now(), Date.now()];
let tickMark = ((2 * Math.PI) / 60) * 8.5;
let interactSpeed = 1;
let reverse = 1;
let timeColor = "#51a2ff";
// draw clock function
function tick() {
  clockCtx.clearRect(0, 0, clockCnv.width, clockCnv.height);

  // clocks tick marks
  for (let i = 1; i < 61; i++) {
    clockCtx.fillStyle = "black";
    clockCtx.save();
    clockCtx.translate(clockCnv.width / 2, clockCnv.height / 2);
    clockCtx.rotate(tickMark);
    if (i % 5 === 0) {
      if (i === 60) clockCtx.fillStyle = timeColor;
      clockCtx.fillRect(
        -(clockCnv.width / 2) + 48,
        -(clockCnv.height / 2) + 48,
        4,
        4
      );
    } else {
      clockCtx.fillRect(
        -(clockCnv.width / 2) + 48,
        -(clockCnv.height / 2) + 48,
        2,
        2
      );
    }
    clockCtx.restore();
    tickMark += (2 * Math.PI) / 60;
  }
  tickMark = ((2 * Math.PI) / 60) * 8.5;

  // clocks bottom
  clockCtx.fillStyle = "black";
  clockCtx.beginPath();
  clockCtx.arc(clockCnv.width / 2, clockCnv.height / 2, 5, Math.PI * 2, 0);
  clockCtx.fill();

  let now = Date.now();
  clockCtx.fillStyle = timeColor;
  // second hand
  clockCtx.save();
  clockCtx.translate(clockCnv.width / 2, clockCnv.height / 2);
  clockCtx.rotate(secondHand);
  clockCtx.fillRect(-1, -45, 2, 180);
  clockCtx.restore();
  if (now - secondTick >= 1000 * interactSpeed) {
    secondHand += ((2 * Math.PI) / 60) * reverse; // 60 seconds for a full revolution
    secondTick = Date.now();
  }

  clockCtx.fillStyle = "black";
  // minute hand
  clockCtx.save();
  clockCtx.translate(clockCnv.width / 2, clockCnv.height / 2);
  clockCtx.rotate(minuteHand);
  clockCtx.fillRect(-2.5, -25, 4, 145);
  clockCtx.restore();
  if (now - minuteTick >= 1000 * interactSpeed) {
    minuteHand += ((2 * Math.PI) / 3600) * reverse; // 60 minutes for a full revolution (3600 seconds)
    minuteTick = Date.now();
  }

  // hour hand
  clockCtx.save();
  clockCtx.translate(clockCnv.width / 2, clockCnv.height / 2);
  clockCtx.rotate(hourHand);
  clockCtx.fillRect(-2.5, -20, 5, 120);
  clockCtx.restore();
  if (now - hourTick >= 1000 * interactSpeed) {
    hourHand += ((2 * Math.PI) / 43200) * reverse; // 12 hours for a full revolution (43200 seconds)
    hourTick = Date.now();
  }

  // clocks top
  clockCtx.fillStyle = "white";
  clockCtx.beginPath();
  clockCtx.arc(clockCnv.width / 2, clockCnv.height / 2, 2.5, Math.PI * 2, 0);
  clockCtx.fill();

  // clock interactions
  const dx = clockMouseX - clockCnv.width / 2;
  const dy = clockMouseY - clockCnv.height / 2;
  const distCenter = Math.hypot(dx, dy);
  const angleToCenter = Math.atan2(dx, dy);
  if (distCenter < 162 && mouseDown) {
    let limit = distCenter / 162;
    interactSpeed = Math.max(1 / (1 + limit) ** 10, 0.01);
    timeColor = "grey";
    if (angleToCenter < 0) reverse = -1;
    else reverse = 1;
  } else {
    timeColor = "#51a2ff";
    interactSpeed = 1;
    reverse = 1;
  }

  requestAnimationFrame(tick);
}
tick();

// Music
let fileInput = document.getElementById("file-input");
function triggerFileInput() {
  fileInput.click();
}

const audioPlayer = document.getElementById("audio-player");
fileInput.addEventListener("change", (event) => {
  const files = event.target.files;

  if (files && files.length > 0) {
    // Process the first selected file
    const file = files[0];
    console.log(`Audio file: ${file.name}, ${file.type}, ${file.size}bytes`);

    audioPlayer.src = URL.createObjectURL(file);
    audioPlayer.play();
  }
});

let interacted = false;
document.addEventListener("click", () => {
  if (!interacted) {
    audioPlayer.play();
    interacted = true;
  }
});

// Drawing
let clearCanvas = false;
function clearCanvasFlag() {
  clearCanvas = true;
}
let swapBtn = document.getElementById("color-swap");
let drawColor = "black";
function swapColors() {
  if (drawColor === "black") {
    drawColor = "white";
    swapBtn.classList =
      "mr-5 text-black bg-white w-15 h-6 rounded-[1.5rem] outline-2 hover:bg-gray-200";
    swapBtn.innerHTML = "white";
  } else {
    drawColor = "black";
    swapBtn.classList =
      "mr-5 text-white bg-black w-15 h-6 rounded-[1.5rem] outline-2 hover:bg-gray-800";
    swapBtn.innerHTML = "black";
  }
}

function draw() {
  if (clearCanvas) {
    drawCtx.clearRect(0, 0, drawCnv.width, drawCnv.height);
    clearCanvas = false;
  }
  let mouseInCanvas =
    drawMouseX > 0 &&
    drawMouseY > 0 &&
    drawMouseX < drawCnv.width &&
    drawMouseY < drawCnv.height;
  if (mouseDown && mouseInCanvas) {
    drawCtx.fillStyle = drawColor;
    drawCtx.beginPath();
    drawCtx.arc(drawMouseX, drawMouseY, 5, Math.PI * 2, 0);
    drawCtx.fill();

    lastXY.forEach((coord) => {
      drawCtx.beginPath();
      drawCtx.arc(coord[0], coord[1], 5, Math.PI * 2, 0);
      drawCtx.fill();
    });
  }
  if (!mouseInCanvas || !mouseDown) lastXY = [];

  requestAnimationFrame(draw);
}
draw();

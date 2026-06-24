// ===== SLIDER =====
let slides = document.querySelectorAll(".slide");
let index = 0;

function changeSlide() {
  slides.forEach(slide => slide.classList.remove("active"));
  index = (index + 1) % slides.length;
  if (slides.length > 0) slides[index].classList.add("active");
}

if (slides.length > 0) {
  setInterval(changeSlide, 3000);
}

// ===== WORDLE GAME =====
const words = [
  "ZUBAT","ARBOK","EKANS","EEVEE","GLOOM",
  "PICHU","GOLEM","ABSOL","BAGON","PARAS",
  "DEINO","GIBLE","DITTO","LOTAD","RALTS",
  "TEPIG","HYPNO","ROTOM","SNIVY","DODUO",
  "NUMEL","BUDEW","LUGIA","MAGBY","SHINX",
  "TOXEL","RIOLU","THROH","BURMY","GOOMY",
  "ZORUA","AIPOM","AZELF","KLINK","LUXIO",
  "INKAY","KLANG","LOKIX","MINUN","ENTEI",
  "HOOPA","PAWMI","PAWMO","YANMA","NACLI",
  "MUNNA","UNOWN","KLAWF","KUBFU"
];

let secret = words[Math.floor(Math.random() * words.length)];

let currentRow = 0;
let currentCol = 0;

const grid = document.getElementById("grid");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");

let boxes = [];

// ===== CREATE GRID =====
if (grid) {
  for (let r = 0; r < 5; r++) {
    let row = document.createElement("div");
    row.className = "row";

    let rowBoxes = [];

    for (let c = 0; c < 5; c++) {
      let box = document.createElement("div");
      box.className = "box";
      row.appendChild(box);
      rowBoxes.push(box);
    }

    boxes.push(rowBoxes);
    grid.appendChild(row);
  }
}

// ===== KEYBOARD LAYOUT =====
const keyboardLayout = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","DEL"]
];

// ===== CREATE KEYBOARD =====
if (keyboard) {
  keyboardLayout.forEach(row => {
    let rowDiv = document.createElement("div");
    rowDiv.className = "keyRow";

    row.forEach(key => {
      let btn = document.createElement("button");
      btn.textContent = key;
      btn.className = "key";

      btn.onclick = () => handleKey(key);

      rowDiv.appendChild(btn);
    });

    keyboard.appendChild(rowDiv);
  });
}

// ===== INPUT HANDLING =====
function handleKey(key) {
  if (currentRow >= 5) return;

  if (key === "DEL") {
    if (currentCol > 0) {
      currentCol--;
      boxes[currentRow][currentCol].textContent = "";
    }
  }

  else if (key === "ENTER") {
    if (currentCol === 5) checkRow();
  }

  else {
    if (currentCol < 5) {
      boxes[currentRow][currentCol].textContent = key;
      currentCol++;
    }
  }
}

// REAL KEYBOARD SUPPORT
document.addEventListener("keydown", (e) => {
  if (currentRow >= 5) return;

  if (e.key === "Backspace") handleKey("DEL");
  else if (e.key === "Enter") handleKey("ENTER");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

// ===== WORD CHECK =====
function checkRow() {
  let guess = boxes[currentRow].map(b => b.textContent).join("");

  let secretArr = secret.split("");
  let guessArr = guess.split("");
  if (!words.includes(guess)) {
  message.textContent = "❌ Not in Pokémon database!";
  return;
}

  // GREEN PASS
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      boxes[currentRow][i].classList.add("green");
      updateKeyColor(guessArr[i], "green");
      secretArr[i] = null;
      guessArr[i] = null;
    }
  }

  // YELLOW / GRAY PASS
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] !== null) {
      let index = secretArr.indexOf(guessArr[i]);

      if (index !== -1) {
        boxes[currentRow][i].classList.add("yellow");
        updateKeyColor(guessArr[i], "yellow");
        secretArr[index] = null;
      } else {
        boxes[currentRow][i].classList.add("gray");
        updateKeyColor(guessArr[i], "gray");
      }
    }
  }

  // RESULT
  if (guess === secret) {
    message.textContent = "🎉 You Win!";
    currentRow = 5;
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === 5) {
    message.textContent = "❌ Game Over! Word was " + secret;
  }
}

// ===== KEY COLOR UPDATE =====
function updateKeyColor(letter, color) {
  document.querySelectorAll(".key").forEach(key => {
    if (key.textContent === letter) {
      key.classList.remove("green", "yellow", "gray");
      key.classList.add(color);
    }
  });
}

// ===== RESTART GAME =====
function restartGame() {
  secret = words[Math.floor(Math.random() * words.length)];
  currentRow = 0;
  currentCol = 0;

  message.textContent = "";

  boxes.flat().forEach(box => {
    box.textContent = "";
    box.classList.remove("green", "yellow", "gray");
  });

  document.querySelectorAll(".key").forEach(key => {
    key.classList.remove("green", "yellow", "gray");
  });
}

// ===== FEEDBACK FORM (SAFE) =====
const form = document.getElementById("feedbackForm");
const thanksMessage = document.getElementById("thanksMessage");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    thanksMessage.textContent = "✅ Thank you for your feedback!";
    form.reset();
  });
}
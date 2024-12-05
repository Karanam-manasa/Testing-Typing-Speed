const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  tryAgainBtn = document.querySelector(".content button"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span"),
  accuracyTag = document.querySelector(".accuracy span"),
  modal = document.querySelector(".modal"),
  overlay = document.querySelector(".modal-overlay"),
  modalWpm = document.getElementById("modal-wpm"),
  modalCpm = document.getElementById("modal-cpm"),
  modalMistakes = document.getElementById("modal-mistakes"),
  modalAccuracy = document.getElementById("modal-accuracy"),
  closeModalBtn = document.getElementById("close-modal");

let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = 0,
  mistakes = 0,
  isTyping = false;

function loadParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = ""; // Clear previous text

  paragraphs[randomIndex].split("").forEach((char) => {
    let span = `<span>${char}</span>`;
    typingText.innerHTML += span;
  });

  typingText.querySelectorAll("span")[0].classList.add("active");
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function calculateAccuracy() {
  const totalTyped = charIndex; // Total characters typed
  const correctCharacters = charIndex - mistakes; // Total correct characters
  const accuracy = totalTyped > 0 ? (correctCharacters / totalTyped) * 100 : 100; // Avoid divide by 0
  return accuracy.toFixed(2); // Return accuracy as a percentage (2 decimal places)
}

function showModal() {
  modalWpm.innerText = wpmTag.innerText;
  modalCpm.innerText = cpmTag.innerText;
  modalMistakes.innerText = mistakeTag.innerText;
  modalAccuracy.innerText = accuracyTag.innerText;

  modal.style.display = "block";
  overlay.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function initTyping() {
  const characters = typingText.querySelectorAll("span");
  const typedChar = inpField.value.split("")[charIndex];

  if (charIndex < characters.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText === typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }

    characters.forEach((span) => span.classList.remove("active"));
    if (charIndex < characters.length) {
      characters[charIndex].classList.add("active");
    }

    let wpm = Math.round(((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60);
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

    wpmTag.innerText = wpm;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = charIndex - mistakes;
    accuracyTag.innerText = calculateAccuracy() + "%"; // Update accuracy
  } else {
    clearInterval(timer);
    inpField.value = "";
    showModal(); // Show modal when test ends
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;

    let wpm = Math.round(((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60);
    wpmTag.innerText = wpm;
  } else {
    clearInterval(timer);
    showModal(); // Show modal when time is up
  }
}

function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = 0;
  mistakes = 0;
  isTyping = false;
  inpField.value = "";
  timeTag.innerText = timeLeft;
  wpmTag.innerText = 0;
  mistakeTag.innerText = 0;
  cpmTag.innerText = 0;
  accuracyTag.innerText = "100%"; // Reset accuracy
  closeModal(); // Close modal if it’s open
}

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
closeModalBtn.addEventListener("click", closeModal);

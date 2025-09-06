const textDisplay = document.getElementById("textDisplay");
const results = document.getElementById("results");
const wpmDisplay = document.getElementById("wpm");
const charactersDisplay = document.getElementById("characters");
const errorsDisplay = document.getElementById("errors");
const timeDisplay = document.getElementById("time");
const resetButton = document.getElementById("resetButton");

const sampleText = `The quick brown fox jumps over the lazy dog. This is a simple sentence to test your typing speed. Keep practicing to improve your skills and achieve a higher words per minute score. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more.`;
let currentPosition = 0;
let startTime, timerInterval;
let typingTime = 0;
let remainingTime = 0;
let charactersTyped = 0;
let errors = 0;
let isTestRunning = false;

function initializeTest() {
    textDisplay.innerHTML = sampleText
        .split("")
        .map(
            char =>
                `<span${char === " " ? ' class="space"' : ""}>${char}</span>`
        )
        .join("");
    textDisplay.style.display = "block";
    results.style.display = "none";
    textDisplay.focus();
    currentPosition = 0;
    wpmDisplay.textContent = "0";
    charactersDisplay.textContent = "0";
    errorsDisplay.textContent = "0";
    timeDisplay.textContent = "60";
    charactersTyped = 0;
    errors = 0;
    isTestRunning = false;
    clearInterval(timerInterval);
    updateTextDisplay();
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeLeft =
            typingTime - Math.floor((new Date() - startTime) / 1000);
        timeDisplay.textContent = timeLeft > 0 ? timeLeft : "0";
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.removeEventListener("keydown", handleKeyPress);
            isTestRunning = false;
            showResults();
        }
        updateWPM();
        remainingTime -= 1;
        document.querySelector(".header .time").textContent =
            "" + remainingTime;
    }, 1000);
}

function updateWPM() {
    const timeElapsed = (new Date() - startTime) / 60000; // in minutes
    const words = charactersTyped / 5; // Average word length is 5 characters
    const wpm = timeElapsed > 0 ? Math.round(words / timeElapsed) : 0;
    wpmDisplay.textContent = wpm;
}

function updateTextDisplay() {
    const textSpans = textDisplay.querySelectorAll("span");
    textSpans.forEach((span, index) => {
        span.classList.remove("correct", "incorrect", "current");
        if (index < currentPosition) {
            span.classList.add(
                span.dataset.correct === "true" ? "correct" : "incorrect"
            );
        } else if (index === currentPosition) {
            span.classList.add("current");
        }
    });
    charactersDisplay.textContent = charactersTyped;
    errorsDisplay.textContent = errors;
}

function showResults() {
    textDisplay.style.display = "none";
    results.style.display = "flex";
    updateWPM();
}

function handleKeyPress(event) {
    if (remainingTime === 0) return;
    if (!isTestRunning) {
        isTestRunning = true;
        startTimer();
    }

    const textSpans = textDisplay.querySelectorAll("span");
    const key = event.key;

    if (key === " ") {
        textDisplay.style.overflowY = "hidden";
    } else {
        textDisplay.style.overflowY = "auto";
    }

    if (key.length === 1 && currentPosition < sampleText.length) {
        const currentChar = sampleText[currentPosition];
        textSpans[currentPosition].dataset.correct = (
            key === currentChar
        ).toString();
        if (key !== currentChar) errors++;
        charactersTyped++;
        currentPosition++;
        updateTextDisplay();
    } else if (key === "Backspace" && currentPosition > 0) {
        currentPosition--;
        if (textSpans[currentPosition].dataset.correct === "false") errors--;
        charactersTyped--;
        delete textSpans[currentPosition].dataset.correct;
        updateTextDisplay();
    }
}

textDisplay.addEventListener("click", () => {
    textDisplay.focus();
});

document.addEventListener("keydown", handleKeyPress);

resetButton.addEventListener("click", () => {
    document.removeEventListener("keydown", handleKeyPress);
    initializeTest();
    document.addEventListener("keydown", handleKeyPress);
});

document.querySelector(".header select").addEventListener("change", e => {
    let time = parseInt(e.target.value);
    timerInterval = 0;
    typingTime = 60 * time;
    remainingTime = 60 * time;
});
// Initialize on page load
initializeTest();

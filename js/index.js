const textDisplay = document.getElementById("textDisplay");
const header = document.querySelector(".header");
const results = document.getElementById("results");
const wpmDisplay = document.getElementById("wpm");
const charactersDisplay = document.getElementById("characters");
const errorsDisplay = document.getElementById("errors");
const timeDisplay = document.getElementById("time");
const timeResultsDisplay = document.getElementById("timeDisplay");
const resetButton = document.getElementById("resetButton");
const timerSelect = document.getElementById("timerSelect");

const paragraphs = [
    `The quick brown fox jumps over the lazy dog. This is a simple sentence to test your typing speed. Keep practicing to improve your skills and achieve a higher words per minute score. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more.`,
    `First of all, thank you for giving me this opportunity to introduce myself. My name is Gobindo Bhor. I am from Komolgonj, Maulovibazar, Sylhet, Bangladesh. I have completed my HSC exam from Komolgonj Govt College. I belong to a nuclear/joint family.`,
    `My hobbies are web development and design , coding and learning new technical skills. I am a confident, disciplined, and self-motivated person. I have also good communication skills and a positive attitude towards my work.`,
    `My short-term goal is to gain experience and improve my skills. My long-term goal is to achieve a good position in a reputed organization where I can grow and contribute to success.`
];
let index = 1;
let sampleText = paragraphs[index];
// const sampleText = `The quick brown fox jumps over the lazy dog. This is a simple sentence to test your typing speed. Keep practicing to improve your skills and achieve a higher words per minute score. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more. Ghs Julian is a dedicated full-stack web application developer and designer from Sylhet, Maulovibazar in Bangladesh. He specializes in creating innovative web solutions and has a strong foundation in various technologies. Hire Ghs Julian, a seasoned web developer and designer with expertise in HTML, CSS, JavaScript, jQuery, PHP, Python, Node.js, MySQL, MongoDB, and more.`;
let currentPosition = 0;
let startTime, timerInterval;
let selectedTime = 30; // Default to 60 seconds
let charactersTyped = 0;
let errors = 0;
let typedWords = 1;
let currentWord = "";
let currentWordIndex = 0;
let isTestRunning = false;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")} Second`;
}
const createIndex = () => {
    index = Math.floor(Math.random() * paragraphs.length);
   sampleText = paragraphs[index];
};

function initializeTest() {
    const words = sampleText.split(" ");
    textDisplay.innerHTML = words
        .map((word, wordIndex) => {
            const chars = word
                .split("")
                .map((char, charIndex) => {
                    const globalIndex =
                        words.slice(0, wordIndex).join(" ").length +
                        charIndex +
                        (wordIndex > 0 ? 1 : 0);
                    return `<span data-index="${globalIndex}">${char}</span>`;
                })
                .join("");
            return `<span class="word">${chars}${
                wordIndex < words.length - 1
                    ? '<span class="space" data-index="${words.slice(0, wordIndex + 1).join(" ").length}">&nbsp;</span>'
                    : ""
            }</span>`;
        })
        .join("");
    header.style.display = "flex";
    results.style.display = "none";
    textDisplay.style.display = "block";
    textDisplay.focus();
    currentPosition = 0;
    wpmDisplay.textContent = "0";
    charactersDisplay.textContent = "0";
    errorsDisplay.textContent = "0";
    timeDisplay.textContent = formatTime(selectedTime);
    timeResultsDisplay.textContent = selectedTime;
    charactersTyped = 0;
    errors = 0;
    typedWords = 0;
    currentWord = "";
    currentWordIndex = 0;
    isTestRunning = false;
    clearInterval(timerInterval);
    updateTextDisplay();
    timerSelect.value = selectedTime || "0";
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeLeft =
            selectedTime - Math.floor((new Date() - startTime) / 1000);
        timeDisplay.textContent = formatTime(timeLeft > 0 ? timeLeft : 0);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.removeEventListener("keydown", handleKeyPress);
            isTestRunning = false;
            showResults();
        }
        updateWPM();
    }, 1000);
}

function updateWPM() {
    const timeElapsed = (new Date() - startTime) / 60000; // in minutes
    const wpm = timeElapsed > 0 ? Math.round(typedWords / timeElapsed) : 0;
    wpmDisplay.textContent = wpm;
}

function updateTextDisplay() {
    const textSpans = textDisplay.querySelectorAll("span[data-index]");
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
    document.getElementById("words-size").textContent = typedWords;
}

function showResults() {
    // header.style.display = "none";
    textDisplay.style.display = "none";
    results.style.display = "flex";
    updateWPM();
}

function checkWord() {
    const words = sampleText.split(" ");
    const expectedWord = words[currentWordIndex];
    if (currentWord === expectedWord) {
        typedWords++;
    }
    currentWord = "";
    currentWordIndex++;
}

function handleKeyPress(event) {
    if (!isTestRunning) {
        if (selectedTime === 0) {
            alert("Please select a timer duration.");
            return;
        }
        isTestRunning = true;
        // header.style.display = "none";
        startTimer();
    }

    const textSpans = textDisplay.querySelectorAll("span[data-index]");
    const key = event.key;

    if (key === " " && currentPosition < sampleText.length) {
        event.preventDefault(); // Prevent spacebar from scrolling
        const currentChar = sampleText[currentPosition];
        if (currentChar === " ") {
            textSpans[currentPosition].dataset.correct = "true";
            checkWord();
            currentPosition++;
        } else {
            textSpans[currentPosition].dataset.correct = "false";
            errors++;
            charactersTyped++;
            currentWord += key;
            currentPosition++;
        }
        updateTextDisplay();
    } else if (key.length === 1 && currentPosition < sampleText.length) {
        const currentChar = sampleText[currentPosition];
        textSpans[currentPosition].dataset.correct = (
            key === currentChar
        ).toString();
        if (key !== currentChar) errors++;
        charactersTyped++;
        currentWord += key;
        currentPosition++;
        updateTextDisplay();
    } else if (key === "Backspace" && currentPosition > 0) {
        currentPosition--;
        if (textSpans[currentPosition].dataset.correct === "false") errors--;
        charactersTyped--;
        currentWord = currentWord.slice(0, -1);
        if (sampleText[currentPosition] === " " && currentWord === "")
            currentWordIndex--;
        delete textSpans[currentPosition].dataset.correct;
        updateTextDisplay();
    }
}

timerSelect.addEventListener("change", e => {
    selectedTime = parseInt(e.target.value) * 60;
    if (e.target.value === "30") selectedTime = 30;
    if (!isTestRunning) {
        timeDisplay.textContent = formatTime(selectedTime);
        timeResultsDisplay.textContent = selectedTime;
    }
});

textDisplay.addEventListener("click", () => {
    textDisplay.focus();
});

document.addEventListener("keydown", handleKeyPress);

resetButton.addEventListener("click", () => {
    createIndex();
    document.removeEventListener("keydown", handleKeyPress);
    initializeTest();
    document.addEventListener("keydown", handleKeyPress);
});

// Initialize on page load
initializeTest();

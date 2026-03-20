let recognition;
let isSpeakingEnabled = false;
let isMicEnabled = false;
let lastBotResponse = "";
let speechUtterance;
let isReplaying = false;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("user-input").addEventListener("keypress", event => {
        if (event.key === "Enter") sendMessage();
    });
});

function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    const chatBox = document.getElementById("chat-messages");

    // Show user message
    const userDiv = document.createElement("div");
    userDiv.classList.add("chat-message");
    userDiv.style.color = "#9FE2BF"; // Customize user message color
    userDiv.textContent = message;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    userInput.value = "";

    // Placeholder typing animation
    const botDiv = document.createElement("div");
    botDiv.classList.add("chat-message", "typing");
    chatBox.appendChild(botDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch response from backend
    fetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        lastBotResponse = data.response;
        startTypingAnimation(botDiv, lastBotResponse); // Typing animation
        if (isSpeakingEnabled) speakText(lastBotResponse);
    })
    .catch(() => {
        startTypingAnimation(botDiv, "Oops! Something went wrong.");
    });
}


function clearChat() {
    document.getElementById("chat-messages").innerHTML = "";
}

function toggleMicrophone() {
    let micButton = document.getElementById("mic-toggle");
    let inputField = document.getElementById("user-input");

    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;  // Keep recording until user clicks toggle again
        recognition.interimResults = true; // Show text as user speaks

        recognition.onresult = event => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    window.finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Display the confirmed text plus whatever is currently being spoken
            inputField.value = window.finalTranscript + interimTranscript;
        };
        
        recognition.onend = () => {
            // Stop mic styling
            micButton.style.color = "";
            isMicEnabled = false;
        };
    }

    if (!isMicEnabled) {
        // Start with whatever is already in the text box
        window.finalTranscript = inputField.value ? inputField.value + (inputField.value.endsWith(' ') ? '' : ' ') : '';
        isMicEnabled = true;
        micButton.style.color = "red";
        recognition.start();
    } else {
        recognition.stop();
        isMicEnabled = false;
        micButton.style.color = "";
    }
}

function speakText(text, onComplete) {
    if (!text) return;
    window.speechSynthesis.cancel();
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = "en-US";
    speechUtterance.onend = () => { if (onComplete) onComplete(); };
    window.speechSynthesis.speak(speechUtterance);
}

function toggleSpeech() {
    let button = document.getElementById("speak-toggle");
    isSpeakingEnabled = !isSpeakingEnabled;
    button.classList.toggle("fa-volume-high");
    button.classList.toggle("fa-volume-xmark");
    button.style.color = isSpeakingEnabled ? "red" : "";
    if (!isSpeakingEnabled) window.speechSynthesis.cancel();
}

function replayLastResponse() {
    let replayIcon = document.getElementById("replay-speak");
    if (!lastBotResponse) return;
    if (isReplaying) {
        window.speechSynthesis.cancel();
        resetReplayIcon();
    } else {
        speakText(lastBotResponse, resetReplayIcon);
        replayIcon.classList.replace("fa-play", "fa-pause");
        isReplaying = true;
    }
}

function resetReplayIcon() {
    let replayIcon = document.getElementById("replay-speak");
    replayIcon.classList.replace("fa-pause", "fa-play");
    isReplaying = false;
}

// Typing animation function
function startTypingAnimation(element, text) {
    let index = 0;
    element.textContent = "";

    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
            element.classList.remove('typing');
        }
    }, 35); // Typing speed in ms
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}
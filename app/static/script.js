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

    // Interactive Spotlight Effect for Glass Panel
    document.addEventListener('mousemove', (e) => {
        const panels = document.querySelectorAll('.glass-panel');
        panels.forEach(panel => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Ripple Effect for buttons
    document.addEventListener('mousedown', function(e) {
        const target = e.target.closest('button');
        if (target) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            let rect = target.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left - 15}px`;
            ripple.style.top = `${e.clientY - rect.top - 15}px`;
            target.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        }
    });
});

function appendMessage(text, sender) {
    const chatBox = document.getElementById("chat-messages");
    
    // Create wrapper for alignment
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", sender);
    
    // Create the actual bubble
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble", `message-${sender}`);
    
    // Use innerHTML to support markdown-like line breaks if needed, or just text
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    
    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return bubble;
}

function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    // Show user message (Right aligned)
    appendMessage(message, "user");
    userInput.value = "";

    // Show typing indicator
    const chatBox = document.getElementById("chat-messages");
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper", "bot");
    
    const typingBubble = document.createElement("div");
    typingBubble.classList.add("message-bubble", "message-bot", "typing-indicator");
    typingBubble.innerHTML = `<span></span><span></span><span></span>`;
    
    wrapper.appendChild(typingBubble);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Fetch response from backend
    fetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: message }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        wrapper.remove();
        
        lastBotResponse = data.response;
        // Append actual bot message
        appendMessage(lastBotResponse, "bot");
        
        if (isSpeakingEnabled) speakText(lastBotResponse);
    })
    .catch(() => {
        wrapper.remove();
        appendMessage("Oops! Something went wrong. Please check your connection or API keys.", "bot");
    });
}

function clearChat() {
    const chatBox = document.getElementById("chat-messages");
    chatBox.innerHTML = `
        <div class="message-wrapper bot">
          <div class="message-bubble message-bot">
             Chat history cleared. How can I help you today?
          </div>
        </div>
    `;
}

function toggleMicrophone() {
    let micButton = document.getElementById("mic-toggle");
    let inputField = document.getElementById("user-input");

    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = event => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    window.finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            inputField.value = window.finalTranscript + interimTranscript;
        };
        
        recognition.onend = () => {
            micButton.classList.remove("active");
            isMicEnabled = false;
        };
    }

    if (!isMicEnabled) {
        window.finalTranscript = inputField.value ? inputField.value + (inputField.value.endsWith(' ') ? '' : ' ') : '';
        isMicEnabled = true;
        micButton.classList.add("active");
        recognition.start();
    } else {
        recognition.stop();
        isMicEnabled = false;
        micButton.classList.remove("active");
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
    let btn = document.getElementById("speak-toggle-btn");
    let icon = document.getElementById("speak-toggle-icon");
    
    isSpeakingEnabled = !isSpeakingEnabled;
    
    if (isSpeakingEnabled) {
        icon.classList.replace("fa-volume-xmark", "fa-volume-high");
        btn.classList.add("active");
    } else {
        icon.classList.replace("fa-volume-high", "fa-volume-xmark");
        btn.classList.remove("active");
        window.speechSynthesis.cancel();
    }
}

function replayLastResponse() {
    let replayIcon = document.getElementById("replay-icon");
    let btn = document.getElementById("replay-btn");
    
    if (!lastBotResponse) return;
    if (isReplaying) {
        window.speechSynthesis.cancel();
        resetReplayIcon();
    } else {
        speakText(lastBotResponse, resetReplayIcon);
        replayIcon.classList.replace("fa-play", "fa-pause");
        btn.classList.add("active");
        isReplaying = true;
    }
}

function resetReplayIcon() {
    let replayIcon = document.getElementById("replay-icon");
    let btn = document.getElementById("replay-btn");
    replayIcon.classList.replace("fa-pause", "fa-play");
    btn.classList.remove("active");
    isReplaying = false;
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    const icon = document.querySelector('.theme-icon');
    
    if (isLight) {
        document.body.classList.remove('dark-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.add('dark-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}
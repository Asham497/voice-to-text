if (!('webkitSpeechRecognition' in window)) {
    alert(
      "Speech recognition is supported only on Desktop Chrome or Edge.\n" +
      "Mobile browsers are not supported."
    );
}

const output = document.getElementById('output');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const listeningBox = document.getElementById('listeningBox');
const languageSelect = document.getElementById('language');

let recognition;
let finalTranscript = '';

// Add Hindi dynamically
if (!Array.from(languageSelect.options).some(opt => opt.value === 'hi-IN')) {
    const option = document.createElement('option');
    option.value = 'hi-IN';
    option.textContent = 'Hindi';
    languageSelect.appendChild(option);
}

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        status.textContent = 'Listening…';
        listeningBox.classList.add('active');
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onend = () => {
        status.textContent = 'Stopped';
        listeningBox.classList.remove('active');
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let lastFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript.trim();
            if (event.results[i].isFinal) {
                lastFinal = text;
            } else {
                interimTranscript = text;
            }
        }

        if (lastFinal && !finalTranscript.endsWith(lastFinal + ' ')) {
            finalTranscript += lastFinal + ' ';
        }

        output.value = finalTranscript + interimTranscript;
        output.scrollTop = output.scrollHeight;
    };

    startBtn.onclick = () => {
        recognition.lang = languageSelect.value;
        recognition.start();
    };

    stopBtn.onclick = () => recognition.stop();

} else {
    alert('Speech recognition not supported. Use Chrome or Edge.');
}

document.getElementById('copyBtn').onclick = () => {
    output.select();
    document.execCommand('copy');
    status.textContent = 'Text copied';
};

document.getElementById('clearBtn').onclick = () => {
    finalTranscript = '';
    output.value = '';
    status.textContent = 'Cleared';
};



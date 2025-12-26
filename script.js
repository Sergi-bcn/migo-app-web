const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.1-8b-instant";

let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let translationTimeout;

function toggleSidebar(id) {
    document.getElementById(id).classList.toggle('mobile-hidden');
}

function setupKey() {
    const key = prompt("Enter Groq API Key:", apiKey);
    if (key) { apiKey = key; localStorage.setItem('migo_api_key', key); }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || !apiKey) return;

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: "You are Migo, a strict English tutor. If mistake: 'CORRECTION: Suggested version: [fix] Reason: [why]'. If perfect, reply normally." },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        const res = data.choices[0].message.content;

        if (res.includes("CORRECTION:")) {
            saveCorrection(text, res);
            appendMessage('migo', "❌ Mistake found. Checked your record.");
        } else {
            appendMessage('migo', res);
        }
    } catch (e) { appendMessage('migo', "Error. Check Key."); }
}

function saveCorrection(wrong, feedback) {
    const fix = feedback.match(/Suggested version: (.*)/i)?.[1] || "Error";
    history.push({ 
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), 
        wrong, fix 
    });
    localStorage.setItem('migo_history', JSON.stringify(history));
    renderLog();
}

function renderLog() {
    const container = document.getElementById('correction-log');
    container.innerHTML = history.slice().reverse().map(item => `
        <div class="log-entry">
            <small>${item.date} ${item.time}</small><br>
            <span style="text-decoration:line-through; color:red;">${item.wrong}</span><br>
            <strong>→ ${item.fix}</strong>
        </div>
    `).join('');
}

// Traducción sin botones (Tiempo real)
function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(async () => {
        const input = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-input`).value;
        const result = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-result`);
        if (!input || !apiKey) return;
        
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{ role: "system", content: "Translate. Only result." }, { role: "user", content: input }]
            })
        });
        const data = await res.json();
        result.innerText = data.choices[0].message.content;
    }, 1000);
}

function appendMessage(s, t) {
    const b = document.getElementById('chat-box');
    const m = document.createElement('div');
    m.className = `message ${s}`; m.innerText = t;
    b.appendChild(m); b.scrollTop = b.scrollHeight;
}

document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
window.onload = renderLog;
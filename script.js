let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let isBlocked = false;
let lastCorrection = "";
let translationTimeout;

function setupKey() {
    const key = prompt("Pega tu Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        location.reload();
    }
}

function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('hidden');
}

function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => runTranslation(dir), 800);
}

async function runTranslation(dir) {
    if (!apiKey) return;
    const from = dir === 'es' ? 'Spanish' : 'English';
    const to = dir === 'es' ? 'English' : 'Spanish';
    const text = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-input`).value.trim();
    const resultDiv = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-result`);

    if (!text) return;
    resultDiv.innerText = "...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: `Translate from ${from} to ${to}. Only text.` }, { role: "user", content: text }]
            })
        });
        const data = await response.json();
        resultDiv.innerText = data.choices[0].message.content;
    } catch (e) { resultDiv.innerText = "Error"; }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || !apiKey) return;

    if (isBlocked) {
        if (text.toLowerCase().includes(lastCorrection.toLowerCase().trim())) {
            isBlocked = false;
            document.getElementById('block-overlay').classList.add('hidden');
            appendMessage('migo', "Perfect! Corrected. Let's continue.");
        } else {
            alert(`Escribe la corrección: "${lastCorrection}"`);
        }
        input.value = '';
        return;
    }

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "Strict tutor. If error: start with 'CORRECTION REQUIRED:'. Then 'Suggested: [fix]' and 'Reason: [why]'." },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        const res = data.choices[0].message.content;

        if (res.includes("CORRECTION REQUIRED:")) {
            const fix = res.match(/Suggested: (.*)/i)?.[1] || "error";
            const reason = res.split('Reason:')[1] || "grammar";
            lastCorrection = fix;
            isBlocked = true;
            saveToLog(text, fix, reason);
            document.getElementById('block-overlay').classList.remove('hidden');
            appendMessage('migo', "❌ Mistake detected. Check the record and type the correct version.");
        } else {
            appendMessage('migo', res);
        }
    } catch (e) { appendMessage('migo', "Error."); }
}

function saveToLog(wrong, fix, reason) {
    history.push({ 
        date: new Date().toLocaleDateString(), 
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        wrong, fix, reason 
    });
    localStorage.setItem('migo_history', JSON.stringify(history));
    renderLog();
}

function renderLog() {
    const log = document.getElementById('correction-log');
    log.innerHTML = history.slice().reverse().map(item => `
        <div class="log-card">
            <small>${item.date} | ${item.time}</small>
            <span class="log-wrong">${item.wrong}</span>
            <span class="log-fix">→ ${item.fix}</span>
        </div>
    `).join('');
}

function appendMessage(s, t) {
    const box = document.getElementById('chat-box');
    const m = document.createElement('div');
    m.className = `message ${s}`; m.innerText = t;
    box.appendChild(m); box.scrollTop = box.scrollHeight;
}

function clearHistory() { history = []; localStorage.removeItem('migo_history'); renderLog(); }

document.getElementById('user-input').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
window.onload = renderLog;
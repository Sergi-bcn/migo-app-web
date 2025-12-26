const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "llama-3.1-8b-instant"; // Modelo corregido

let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let currentMode = "Grammar";
let currentTone = "Elegant";
let translationTimeout;

function setupKey() {
    const key = prompt("Enter Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        alert("API Key saved.");
    }
}

function updateSettings() {
    currentMode = document.getElementById('mode-select').value;
    currentTone = document.getElementById('tone-select').value;
}

function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => runTranslation(dir), 1000);
}

async function runTranslation(dir) {
    if (!apiKey) return;
    const to = dir === 'en' ? 'Spanish' : 'English';
    const input = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-input`).value.trim();
    const resultDiv = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-result`);
    
    if (!input) { resultDiv.innerText = ""; return; }
    resultDiv.innerText = "Translating...";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{ role: "system", content: `Translate to ${to}. Return ONLY translation.` }, { role: "user", content: input }],
                temperature: 0.1
            })
        });
        const data = await response.json();
        resultDiv.innerText = data.choices[0].message.content;
    } catch (e) { resultDiv.innerText = "Check API Key."; }
}

async function sendMessage() {
    if (!apiKey) { setupKey(); return; }
    const inputField = document.getElementById('user-input');
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage('user', text);
    inputField.value = '';

    const systemPrompt = `You are Migo, a strict English tutor. Focus: ${currentMode}. Tone: ${currentTone}. 
    IF ERROR: Start ONLY with 'CORRECTION:'. Provide 'Suggested version: [sentence]' and 'Reason: [why]'.
    IF PERFECT: Respond normally in ${currentTone} style.`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }],
                temperature: 0.3
            })
        });
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        if (aiResponse.includes("CORRECTION:")) {
            processCorrection(text, aiResponse);
            appendMessage('migo', "❌ Mistake detected. Please fix it.");
        } else {
            appendMessage('migo', aiResponse);
        }
    } catch (e) { appendMessage('migo', "Error. Check API Key."); }
}

function processCorrection(wrong, feedback) {
    const fix = feedback.match(/Suggested version: (.*)/i)?.[1] || "Ver log";
    const reason = feedback.split('Reason:')[1] || "Grammar error";
    const entry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        wrong, fix, reason: reason.trim()
    };
    history.push(entry);
    localStorage.setItem('migo_history', JSON.stringify(history));
    renderLog();
}

function renderLog() {
    const container = document.getElementById('correction-log');
    container.innerHTML = "";
    history.slice().reverse().forEach(item => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `
            <small>${item.date} ${item.time}</small><br>
            <span class="log-wrong">"${item.wrong}"</span>
            <span class="log-fix">→ ${item.fix}</span>
        `;
        container.appendChild(div);
    });
}

function clearHistory() { if(confirm("Clear?")) { history = []; localStorage.removeItem('migo_history'); renderLog(); } }

function exportHistory() {
    let csv = "Date,Time,Wrong,Fix\n";
    history.forEach(h => csv += `${h.date},${h.time},"${h.wrong}","${h.fix}"\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'migo_report.csv'; a.click();
}

function appendMessage(sender, text) {
    const box = document.getElementById('chat-box');
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

function toggleTools() { document.getElementById('tools-panel').classList.toggle('hidden'); }
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
window.onload = renderLog;
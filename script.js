/**
 * MODIFICACIÓN PARA USO LOCAL:
 * Si quieres que funcione sin pedir la clave cada vez que borres caché, 
 * puedes escribir tu clave entre las comillas de la siguiente variable:
 */
const LOCAL_API_KEY = ""; // <--- PEGA TU CLAVE AQUÍ PARA USO LOCAL PRIVADO

const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

// Lógica de obtención de clave (GitHub Safe)
let apiKey = LOCAL_API_KEY || localStorage.getItem('migo_api_key') || "";

// Cargar historial persistente
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let currentMode = "Grammar";
let currentTone = "Elegant";
let translationTimeout;

function setupKey() {
    const key = prompt("Enter your Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        alert("API Key configurada.");
    }
}

function updateSettings() {
    currentMode = document.getElementById('mode-select').value;
    currentTone = document.getElementById('tone-select').value;
}

// TRADUCCIÓN EN TIEMPO REAL (Debounce)
function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => runTranslation(dir), 1000);
}

async function runTranslation(dir) {
    if (!apiKey) return;
    const from = dir === 'en' ? 'English' : 'Spanish';
    const to = dir === 'en' ? 'Spanish' : 'English';
    const input = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-input`).value.trim();
    const resultDiv = document.getElementById(`${dir}-to-${dir==='en'?'es':'en'}-result`);
    
    if (!input) { resultDiv.innerText = ""; return; }
    resultDiv.innerText = "...";

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: `Translate to ${to}. Return ONLY translation.` }, { role: "user", content: input }],
                temperature: 0.1
            })
        });
        const data = await response.json();
        resultDiv.innerText = data.choices[0].message.content;
    } catch (e) { resultDiv.innerText = "Error de conexión o API Key inválida."; }
}

// ENVÍO DE MENSAJES Y FILTRO ESTRICTO
async function sendMessage() {
    if (!apiKey) { setupKey(); return; }
    const inputField = document.getElementById('user-input');
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage('user', text);
    inputField.value = '';

    const systemPrompt = `You are Migo, a strict English tutor. Focus: ${currentMode}. Tone: ${currentTone}. 
    STRICT RULE: If you find ANY mistake (grammar, spelling, etc), start your response ONLY with 'CORRECTION:'. 
    Then provide 'Suggested version: [correct sentence]' and 'Reason: [explanation]'.
    If it's perfect, respond normally.`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: text }],
                temperature: 0.3
            })
        });
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        if (aiResponse.includes("CORRECTION:")) {
            processCorrection(text, aiResponse);
            appendMessage('migo', "❌ Mistake detected. Check your record and fix it to continue.");
        } else {
            appendMessage('migo', aiResponse);
        }
    } catch (e) { appendMessage('migo', "Error. Verifica tu configuración de API."); }
}

function processCorrection(wrongText, aiFeedback) {
    const suggestion = aiFeedback.match(/Suggested version: (.*)/i)?.[1] || "Ver log";
    const reason = aiFeedback.split('Reason:')[1] || "Error gramatical";
    
    const entry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        wrong: wrongText,
        fix: suggestion,
        reason: reason.trim()
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
            <div class="log-meta">${item.date} | ${item.time}</div>
            <span class="log-wrong">"${item.wrong}"</span>
            <span class="log-fix">→ ${item.fix}</span>
            <p style="font-size:0.7rem; color:#64748b; margin-top:4px;">${item.reason}</p>
        `;
        container.appendChild(div);
    });
    updateAnalytics();
}

function updateAnalytics() {
    if (history.length === 0) return;
    const reasons = history.map(h => h.reason.split(' ')[0]);
    const top = reasons.sort((a,b) => reasons.filter(v => v===a).length - reasons.filter(v => v===b).length).pop();
    document.getElementById('common-error-tag').querySelector('span').innerText = top || "None";
}

function exportHistory() {
    let csv = "Date,Time,Wrong,Fix,Reason\n";
    history.forEach(h => csv += `${h.date},${h.time},"${h.wrong}","${h.fix}","${h.reason}"\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'migo_academy_report.csv';
    a.click();
}

function clearHistory() { 
    if(confirm("¿Borrar todo el historial?")) { history = []; localStorage.removeItem('migo_history'); renderLog(); }
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

document.getElementById('user-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
window.onload = () => { if (!apiKey) setupKey(); renderLog(); };
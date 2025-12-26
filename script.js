let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let isBlocked = false;
let lastCorrection = "";
let translationTimeout;

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

function setupKey() {
    const key = prompt("Introduce tu Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        location.reload();
    }
}

// LÓGICA DE TRADUCCIÓN
function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('hidden');
}

function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => runTranslation(dir), 800);
}

async function runTranslation(dir) {
    const from = dir === 'es' ? 'Spanish' : 'English';
    const to = dir === 'es' ? 'English' : 'Spanish';
    const text = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-input`).value.trim();
    const resultDiv = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-result`);

    if (!text || !apiKey) return;
    resultDiv.innerText = "Translating...";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: `Translate from ${from} to ${to}. Return ONLY the translation.` }, { role: "user", content: text }],
                temperature: 0.1
            })
        });
        const data = await response.json();
        resultDiv.innerText = data.choices[0].message.content;
    } catch (e) { resultDiv.innerText = "Error..."; }
}

// CHAT Y CORRECCIONES
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();

    if (!text || !apiKey) return;

    // Si está bloqueado, verificar si el usuario ha escrito la corrección
    if (isBlocked) {
        if (text.toLowerCase().includes(lastCorrection.toLowerCase().trim())) {
            isBlocked = false;
            document.getElementById('block-overlay').classList.add('hidden');
            appendMessage('migo', "¡Correcto! Has aplicado la corrección. Podemos continuar.");
        } else {
            alert(`Para continuar, debes escribir la frase corregida: "${lastCorrection}"`);
        }
        input.value = '';
        return;
    }

    appendMessage('user', text);
    input.value = '';

    const prompt = `You are Migo, a strict English tutor. 
    RULE: If the user message has ANY grammar/spelling error, you MUST start your response with 'CORRECTION REQUIRED:'. 
    Provide the correct version after 'Suggested:' and the reason after 'Reason:'. 
    If it is perfect, respond normally.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: prompt }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        const data = await response.json();
        const res = data.choices[0].message.content;

        if (res.includes("CORRECTION REQUIRED:")) {
            const fix = res.match(/Suggested: (.*)/i)?.[1] || "Check grammar";
            const reason = res.split('Reason:')[1] || "Error detected";
            
            lastCorrection = fix;
            isBlocked = true;
            
            saveToLog(text, fix, reason);
            document.getElementById('block-overlay').classList.remove('hidden');
            appendMessage('migo', "❌ He detectado un error. Revisa el Academy Record a la izquierda y escribe la frase correcta para desbloquear el chat.");
        } else {
            appendMessage('migo', res);
        }
    } catch (e) { appendMessage('migo', "Error de conexión."); }
}

function saveToLog(wrong, fix, reason) {
    const entry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        wrong, fix, reason
    };
    history.push(entry);
    localStorage.setItem('migo_history', JSON.stringify(history));
    renderLog();
}

function renderLog() {
    const log = document.getElementById('correction-log');
    log.innerHTML = history.slice().reverse().map(item => `
        <div class="log-card">
            <div class="log-time">${item.date} | ${item.time}</div>
            <span class="log-wrong">"${item.wrong}"</span>
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

function clearHistory() { if(confirm("¿Borrar historial?")) { history = []; localStorage.removeItem('migo_history'); renderLog(); }}

document.getElementById('user-input').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
window.onload = () => { renderLog(); if(!apiKey) setTimeout(setupKey, 500); };
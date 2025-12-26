let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let isBlocked = false;
let lastCorrection = "";
let translationTimeout;

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

window.onload = () => {
    updateAnalytics();
    renderLog();
    if(!apiKey) setTimeout(setupKey, 1000);
};

function setupKey() {
    const key = prompt("Pega tu Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        location.reload();
    }
}

// PANEL TRADUCTOR
document.getElementById('toggle-trans').onclick = () => {
    document.getElementById('translator-panel').classList.toggle('hidden');
};

function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => runTranslation(dir), 800);
}

async function runTranslation(dir) {
    if (!apiKey) return;
    const text = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-input`).value.trim();
    const resultDiv = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-result`);
    if (!text) { resultDiv.innerText = ""; return; }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "system", content: `Translate to ${dir==='es'?'English':'Spanish'}. Return only the result.` }, { role: "user", content: text }],
                temperature: 0.1
            })
        });
        const data = await response.json();
        resultDiv.innerText = data.choices[0].message.content;
    } catch (e) { resultDiv.innerText = "Error..."; }
}

// CHAT Y ANALYTICS
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || !apiKey) return;

    if (isBlocked) {
        // Limpiamos puntuación para comparar corrección
        const cleanUser = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
        const cleanFix = lastCorrection.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
        
        if (cleanUser === cleanFix) {
            isBlocked = false;
            document.getElementById('block-overlay').classList.add('hidden');
            appendMessage('migo', "Correct! You've learned it. Let's continue.");
        } else {
            alert(`Debes escribir exactamente: "${lastCorrection}"`);
        }
        input.value = '';
        return;
    }

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a strict English tutor. If the user makes an error, start WITH 'ERROR_TYPE:'. Then: 'Type: [Grammar/Spelling/Vocabulary]', 'Correct: [sentence]', 'Reason: [why]'. If perfect, just respond." },
                    { role: "user", content: text }
                ],
                temperature: 0.3
            })
        });
        const data = await response.json();
        const res = data.choices[0].message.content;

        if (res.includes("ERROR_TYPE:")) {
            const type = res.match(/Type: (.*)/i)?.[1] || "Grammar";
            const fix = res.match(/Correct: (.*)/i)?.[1] || "";
            const reason = res.match(/Reason: (.*)/i)?.[1] || "";
            
            lastCorrection = fix;
            isBlocked = true;
            saveToLog(text, fix, type, reason);
            document.getElementById('block-overlay').classList.remove('hidden');
            appendMessage('migo', `⚠️ Error detected (${type}). Check the Academy Record and rewrite the sentence.`);
        } else {
            appendMessage('migo', res);
        }
    } catch (e) { appendMessage('migo', "Error de conexión."); }
}

function saveToLog(wrong, fix, type, reason) {
    history.push({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        wrong, fix, type, reason
    });
    localStorage.setItem('migo_history', JSON.stringify(history));
    updateAnalytics();
    renderLog();
}

function updateAnalytics() {
    document.getElementById('total-count').innerText = history.length;
    if (history.length > 0) {
        const types = history.map(h => h.type);
        const mostCommon = types.sort((a,b) => types.filter(v => v===a).length - types.filter(v => v===b).length).pop();
        document.getElementById('top-error-type').innerText = mostCommon;
    }
}

function renderLog() {
    const filter = document.getElementById('error-filter').value;
    const log = document.getElementById('correction-log');
    const filtered = filter === 'all' ? history : history.filter(h => h.type === filter);
    
    log.innerHTML = filtered.slice().reverse().map(item => `
        <div class="log-card">
            <small>${item.date} | ${item.time} | ${item.type}</small>
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

function clearHistory() { if(confirm("¿Borrar todo?")) { history = []; localStorage.removeItem('migo_history'); updateAnalytics(); renderLog(); } }

document.getElementById('user-input').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
let apiKey = localStorage.getItem('migo_api_key') || "";
let history = JSON.parse(localStorage.getItem('migo_history')) || [];
let isBlocked = false;
let lastCorrection = "";
let translationTimeout;

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

window.onload = () => {
    updateAnalytics();
    renderLog();
};

function setupKey() {
    const key = prompt("Pega tu Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        location.reload();
    }
}

// EXPORTAR RAPORT CON RESUMEN ESTADÍSTICO
function exportToCSV() {
    if (history.length === 0) return alert("No data to export.");
    
    // Calcular estadísticas
    const stats = history.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {});

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "--- MIGO ACADEMY RAPORT ---\n";
    csvContent += `Total Errors,${history.length}\n`;
    csvContent += `Grammar Errors,${stats.Grammar || 0}\n`;
    csvContent += `Spelling Errors,${stats.Spelling || 0}\n`;
    csvContent += `Vocabulary Errors,${stats.Vocabulary || 0}\n\n`;
    csvContent += "DATE,TIME,TYPE,YOUR INPUT,CORRECT VERSION,REASON\n";
    
    history.forEach(item => {
        const row = `"${item.date}","${item.time}","${item.type}","${item.wrong}","${item.fix}","${item.reason}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Migo_Full_Raport_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || !apiKey) return;

    if (isBlocked) {
        const cleanUser = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
        const cleanFix = lastCorrection.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").trim();
        
        if (cleanUser === cleanFix) {
            isBlocked = false;
            exitErrorMode();
            appendMessage('migo', "Well done! Corrected. Let's continue our talk.");
        } else {
            appendMessage('migo', `⚠️ That's not correct. Try again: "${lastCorrection}"`);
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
                    { role: "system", content: "Elite English Tutor. If error detected, start with 'ERROR_DETECTED'. Then provide: 'Type: [Grammar/Spelling/Vocabulary]', 'Correct: [sentence]', 'Reason: [why]'. If no error, just reply." },
                    { role: "user", content: text }
                ],
                temperature: 0.3
            })
        });
        const data = await response.json();
        const res = data.choices[0].message.content;

        if (res.includes("ERROR_DETECTED")) {
            const type = res.match(/Type: (.*)/i)?.[1] || "Grammar";
            const fix = res.match(/Correct: (.*)/i)?.[1] || "";
            const reason = res.match(/Reason: (.*)/i)?.[1] || "";
            
            lastCorrection = fix;
            isBlocked = true;
            enterErrorMode(fix);
            saveToLog(text, fix, type, reason);
            appendMessage('migo', `❌ Error found. Check the Academy Record and rewrite the sentence below.`);
        } else {
            appendMessage('migo', res);
        }
    } catch (e) { appendMessage('migo', "Connection error."); }
}

function enterErrorMode(fix) {
    document.getElementById('input-container').classList.add('error-mode');
    document.getElementById('correction-hint').classList.remove('hidden');
    document.getElementById('hint-text').innerText = fix;
    document.getElementById('status-dot').classList.add('waiting');
}

function exitErrorMode() {
    document.getElementById('input-container').classList.remove('error-mode');
    document.getElementById('correction-hint').classList.add('hidden');
    document.getElementById('status-dot').classList.remove('waiting');
}

function saveToLog(wrong, fix, type, reason) {
    history.push({ date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), wrong, fix, type, reason });
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
            <small>${item.date} | ${item.time} | <b>${item.type}</b></small>
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

document.getElementById('toggle-trans').onclick = () => document.getElementById('translator-panel').classList.toggle('hidden');

function debounceTranslate(dir) {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(async () => {
        const text = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-input`).value.trim();
        const resDiv = document.getElementById(`${dir}-to-${dir==='es'?'en':'es'}-result`);
        if(!text || !apiKey) return;
        try {
            const r = await fetch(API_URL, { method:'POST', headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'}, body:JSON.stringify({model:"llama-3.1-8b-instant", messages:[{role:"system",content:`Translate to ${dir==='es'?'English':'Spanish'}. Return only text.`},{role:"user",content:text}]})});
            const d = await r.json(); resDiv.innerText = d.choices[0].message.content;
        } catch(e) { resDiv.innerText = "Error..."; }
    }, 800);
}

function clearHistory() { if(confirm("¿Delete all history?")) { history = []; localStorage.removeItem('migo_history'); updateAnalytics(); renderLog(); } }
document.getElementById('user-input').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
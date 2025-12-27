let isLocked = false;
let corrections = JSON.parse(localStorage.getItem('migo_corrections')) || [];

function toggleReport() { 
    document.getElementById('report-panel').classList.toggle('active');
    document.getElementById('translator-panel').classList.remove('active');
}
function toggleTranslator() { 
    document.getElementById('translator-panel').classList.toggle('active');
    document.getElementById('report-panel').classList.remove('active');
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch("/api/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are Migo, a strict English teacher. 1. If user makes a mistake, start ONLY with 'CORRECTION:' then provide the correct sentence. 2. If they fix it, start with 'FIXED:' and continue the chat normally. 3. Be very strict with grammar." },
                    { role: "user", content: text }
                ]
            })
        });
        
        const data = await response.json();
        const reply = data.choices[0].message.content;

        if (reply.toUpperCase().includes("CORRECTION:")) {
            isLocked = true;
            document.getElementById('lock-notice').style.display = 'block';
            document.getElementById('input-container').classList.add('locked-container');
            saveToReport(text, reply);
        } else if (reply.toUpperCase().includes("FIXED:") || !isLocked) {
            isLocked = false;
            document.getElementById('lock-notice').style.display = 'none';
            document.getElementById('input-container').classList.remove('locked-container');
        }

        appendMessage('migo', reply);
    } catch (e) { appendMessage('migo', "Connection error. Please try again."); }
}

function saveToReport(wrong, feedback) {
    const entry = { 
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        wrong: wrong, 
        feedback: feedback.replace("CORRECTION:", "").trim() 
    };
    corrections.push(entry);
    localStorage.setItem('migo_corrections', JSON.stringify(corrections));
    renderReport();
}

function renderReport() {
    const log = document.getElementById('correction-log');
    if(!log) return;
    log.innerHTML = corrections.slice().reverse().map(c => `
        <div class="log-entry">
            <small style="color:#64748b;">${c.date}</small><br>
            <span style="color:#e11d48; font-weight:bold;">✗ ${c.wrong}</span><br>
            <span style="color:#059669; font-weight:600;">✓ ${c.feedback}</span>
        </div>
    `).join('');
}

async function autoTranslate(mode) {
    const inputId = mode === 'en-es' ? 'en-input' : 'es-input';
    const resultId = mode === 'en-es' ? 'en-es-result' : 'es-en-result';
    const text = document.getElementById(inputId).value;
    if (text.length < 3) return;

    try {
        const response = await fetch("/api/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: "user", content: `Translate to ${mode === 'en-es' ? 'Spanish' : 'English'}: ${text}` }] })
        });
        const data = await response.json();
        document.getElementById(resultId).innerText = data.choices[0].message.content;
    } catch (e) { console.error("Translate error"); }
}

function appendMessage(role, text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `<strong>${role === 'user' ? 'You' : 'Migo'}</strong>${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function clearHistory() { if(confirm("Clear all report history?")) { corrections = []; localStorage.removeItem('migo_corrections'); renderReport(); } }
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
window.onload = renderReport;
let isLocked = false;
let corrections = JSON.parse(localStorage.getItem('migo_corrections')) || [];

function toggleRecord() { document.getElementById('record-panel').classList.toggle('active'); }
function toggleTranslator() { document.getElementById('translator-modal').classList.toggle('active'); }

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || isLocked && !text.includes("")) return; 

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch("/api/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are Migo, a strict English tutor. If the user makes a mistake, start with 'CORRECTION:'. You must NOT continue the conversation until they repeat the correct sentence." },
                    { role: "user", content: text }
                ]
            })
        });
        
        const data = await response.json();
        const reply = data.choices[0].message.content;

        if (reply.includes("CORRECTION:")) {
            isLocked = true;
            document.getElementById('lock-notice').style.display = 'block';
            document.getElementById('user-input').placeholder = "Rewrite correctly...";
            saveCorrection(text, reply);
        } else {
            isLocked = false;
            document.getElementById('lock-notice').style.display = 'none';
            document.getElementById('user-input').placeholder = "Type in English...";
        }
        appendMessage('migo', reply);
    } catch (e) { appendMessage('migo', "Connection error."); }
}

async function autoTranslate(mode) {
    const inputId = mode === 'en-es' ? 'en-input' : 'es-input';
    const resultId = mode === 'en-es' ? 'en-es-result' : 'es-en-result';
    const text = document.getElementById(inputId).value;
    
    if (text.length < 2) return;

    const prompt = mode === 'en-es' ? `Translate to Spanish: ${text}` : `Translate to English: ${text}`;
    
    try {
        const response = await fetch("/api/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
        });
        const data = await response.json();
        document.getElementById(resultId).innerText = data.choices[0].message.content;
    } catch (e) { console.error("Trans error"); }
}

function appendMessage(role, text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `<strong>${role === 'user' ? 'You' : 'Migo'}</strong>${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function saveCorrection(wrong, feedback) {
    corrections.push({ date: new Date().toLocaleTimeString(), wrong, feedback });
    localStorage.setItem('migo_corrections', JSON.stringify(corrections));
    renderLog();
}

function renderLog() {
    const log = document.getElementById('correction-log');
    if(!log) return;
    log.innerHTML = corrections.slice().reverse().map(c => `
        <div class="log-entry">
            <strong>${c.date}</strong><br>
            <span style="color:red">✗ ${c.wrong}</span><br>
            <span style="color:green">✓ ${c.feedback}</span>
        </div>
    `).join('');
}

function clearHistory() { if(confirm("Clear?")) { corrections = []; localStorage.removeItem('migo_corrections'); renderLog(); } }
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
window.onload = renderLog;
let isLocked = false;
let corrections = JSON.parse(localStorage.getItem('migo_corrections')) || [];

function toggleRecord() { 
    document.getElementById('record-panel').classList.toggle('active');
    document.getElementById('translator-panel').classList.remove('active');
}
function toggleTranslator() { 
    document.getElementById('translator-panel').classList.toggle('active');
    document.getElementById('record-panel').classList.remove('active');
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
                    { role: "system", content: "You are Migo, a strict English tutor. 1. If user makes a mistake, start ONLY with 'CORRECTION:' and then explain. 2. If they fix it, start with 'FIXED:' and continue. 3. Be concise." },
                    { role: "user", content: text }
                ]
            })
        });
        
        const data = await response.json();
        const reply = data.choices[0].message.content;

        if (reply.includes("CORRECTION:")) {
            isLocked = true;
            document.getElementById('lock-notice').style.display = 'block';
            document.getElementById('input-container').classList.add('locked-container');
            saveCorrection(text, reply);
        } else if (reply.includes("FIXED:") || !isLocked) {
            isLocked = false;
            document.getElementById('lock-notice').style.display = 'none';
            document.getElementById('input-container').classList.remove('locked-container');
        }

        appendMessage('migo', reply);
    } catch (e) { appendMessage('migo', "Error."); }
}

function saveCorrection(wrong, feedback) {
    corrections.push({ 
        date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        wrong: wrong, 
        feedback: feedback.replace("CORRECTION:", "").trim() 
    });
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

async function autoTranslate(mode) {
    const inputId = mode === 'en-es' ? 'en-input' : 'es-input';
    const resultId = mode === 'en-es' ? 'en-es-result' : 'es-en-result';
    const text = document.getElementById(inputId).value;
    if (text.length < 3) return;

    const response = await fetch("/api/chat", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: "user", content: `Translate to ${mode === 'en-es' ? 'Spanish' : 'English'}: ${text}` }] })
    });
    const data = await response.json();
    document.getElementById(resultId).innerText = data.choices[0].message.content;
}

function appendMessage(role, text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `<strong>${role === 'user' ? 'You' : 'Migo'}</strong>${text}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function clearHistory() { if(confirm("Clear?")) { corrections = []; localStorage.removeItem('migo_corrections'); renderLog(); } }
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
window.onload = renderLog;
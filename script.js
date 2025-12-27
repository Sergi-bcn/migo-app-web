let corrections = JSON.parse(localStorage.getItem('migo_corrections')) || [];

function toggleRecord() { document.getElementById('record-panel').classList.toggle('active'); }
function toggleTranslator() { document.getElementById('translator-modal').classList.toggle('active'); }

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
                    { role: "system", content: "You are Migo, a professional English tutor. If the user makes a mistake, start your response with 'CORRECTION:'." },
                    { role: "user", content: text }
                ]
            })
        });
        
        const data = await response.json();
        const reply = data.choices[0].message.content;

        if (reply.toLowerCase().includes("correction")) {
            saveCorrection(text, reply);
        }
        appendMessage('migo', reply);
    } catch (e) {
        appendMessage('migo', "Migo is offline. Please try again later.");
    }
}

function appendMessage(role, text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${role}`;
    
    // Añadimos la etiqueta de nombre para distinguir quién habla
    const label = role === 'user' ? '<strong>You</strong>' : '<strong>Migo</strong>';
    div.innerHTML = label + text;
    
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function saveCorrection(wrong, feedback) {
    corrections.push({ date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), wrong, feedback });
    localStorage.setItem('migo_corrections', JSON.stringify(corrections));
    renderLog();
}

function renderLog() {
    const log = document.getElementById('correction-log');
    if(!log) return;
    log.innerHTML = corrections.slice().reverse().map(c => `
        <div class="log-entry">
            <small>${c.date}</small><br>
            <span style="color:#e11d48; font-weight:600;">✗ ${c.wrong}</span><br>
            <span style="color:#059669; font-weight:500;">✓ ${c.feedback}</span>
        </div>
    `).join('');
}

function clearHistory() {
    if(confirm("Delete your history?")) {
        corrections = [];
        localStorage.removeItem('migo_corrections');
        renderLog();
    }
}

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

window.onload = renderLog;
let currentRigor = "relaxed";

function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Usamos una clase CSS específica para no interferir con otros estilos
    el.classList.toggle('show-popup');
}

function handleChatEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function copyText(btn) {
    const text = btn.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(text);
    const originalSvg = btn.innerHTML;
    btn.innerHTML = `<span style="font-size:10px; color:var(--verde); font-weight:800">OK</span>`;
    setTimeout(() => btn.innerHTML = originalSvg, 1500);
}

function clearTrans(lang) {
    document.getElementById(`in-${lang}`).value = "";
    document.getElementById(lang === 'es' ? 'out-en' : 'out-es').innerText = "";
}

function selectOption(el, targetId, value) {
    const parent = el.parentElement;
    Array.from(parent.children).forEach(child => {
        if(child.classList) child.classList.remove('active');
    });
    el.classList.add('active');
    document.getElementById(targetId).innerText = el.innerText;
    if (targetId === 'status-rigor') currentRigor = value;
}

function handleTransEnter(event, sl, tl) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        translateNow(sl, tl);
    }
}

async function translateNow(sl, tl) {
    const text = document.getElementById(`in-${sl}`).value.trim();
    const out = document.getElementById(sl === 'es' ? 'out-en' : 'out-es');
    if (!text) return;
    out.innerText = "...";
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        out.innerText = data[0].map(s => s[0]).join('');
    } catch (e) { out.innerText = "Error."; }
}

function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    if (text && text !== "...") {
        navigator.clipboard.writeText(text);
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
        addChatMessage("I'm here to help you practice! / Estoy aquí para ayudarte a practicar.", 'migo');
    }, 700);
}

function addChatMessage(text, type) {
    const chat = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)" title="Copy / Copiar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}
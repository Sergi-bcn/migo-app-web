let currentMigoConfig = {
    rigor: 'Estricto / Strict',
    estilo: 'Normal'
};

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    const btnPulsado = event.currentTarget;
    const botonesDelGrupo = btnPulsado.parentElement.querySelectorAll('.conf-btn');
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    btnPulsado.classList.add('active');

    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerHTML = `<div><strong>RIGOR:</strong> ${currentMigoConfig.rigor}</div><div><strong>STYLE:</strong> ${currentMigoConfig.estilo}</div>`;
    }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input || !input.value.trim()) return;

    const userText = input.value;

    // Cierre automático de ventanas del header
    const popups = document.querySelectorAll('.popup-modal');
    popups.forEach(p => p.innerHTML = '');

    // Renderizar mensaje de usuario (Izquierda, 17px)
    const userMsg = document.createElement('div');
    userMsg.style.cssText = "align-self: flex-start; background: #f39c12; color: white; padding: 12px 18px; border-radius: 15px 15px 15px 0; margin-bottom: 15px; max-width: 85%; font-size: 17px; font-weight: 500; text-align: left;";
    userMsg.innerText = userText;
    chatBox.appendChild(userMsg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText, config: currentMigoConfig })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        renderMigoResponse(data.reply);
    } catch (error) {
        console.error("Error detallado:", error);
        renderMigoResponse("Error: No he podido conectar con la AI. Revisa la GROQ_API_KEY en Vercel y redespliega.");
    }
}

function renderMigoResponse(text) {
    const chatBox = document.getElementById('chat-box');
    const migoMsg = document.createElement('div');
    migoMsg.style.cssText = "align-self: flex-start; background: #f1f5f9; color: #4a5568; padding: 12px 18px; border-radius: 15px 15px 15px 0; margin-bottom: 15px; max-width: 85%; font-size: 17px; border: 1px solid #edf2f7; text-align: left;";
    migoMsg.innerText = text;
    chatBox.appendChild(migoMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
let currentMigoConfig = {
    rigor: 'Estricto / Strict',
    estilo: 'Normal'
};

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    
    // Gestión de botones activos por grupo
    const btnPulsado = event.currentTarget;
    const contenedorPadre = btnPulsado.parentElement;
    const botonesDelGrupo = contenedorPadre.querySelectorAll('.conf-btn');
    
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    btnPulsado.classList.add('active');

    // Registro explícito en la ventana de usuario
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>RIGOR:</strong> ${currentMigoConfig.rigor}</div>
            <div><strong>STYLE:</strong> ${currentMigoConfig.estilo}</div>
        `;
    }
}

async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;
    outputDiv.innerText = "Translating / Traduciendo...";

    try {
        const sl = mode === 'es-en' ? 'es' : 'en';
        const tl = mode === 'es-en' ? 'en' : 'es';
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data[0] && data[0][0]) {
            outputDiv.innerText = data[0][0][0];
            outputDiv.style.color = "#2d3748";
        }
    } catch (e) {
        outputDiv.innerText = "Error";
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input.value.trim()) return;

    const msg = document.createElement('div');
    msg.className = 'message user-msg';
    msg.innerText = input.value;
    chatBox.appendChild(msg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}
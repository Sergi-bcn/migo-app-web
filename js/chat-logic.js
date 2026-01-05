let currentMigoConfig = { rigor: 'Estricto', estilo: 'Normal' };

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    
    // Obtenemos el contenedor específico (Rigor o Estilo) para no desmarcar el otro menú
    const btnPulsado = event.currentTarget;
    const contenedorPadre = btnPulsado.parentElement;
    
    // Solo quitamos el verde a los botones dentro del mismo grupo
    const botonesDelGrupo = contenedorPadre.querySelectorAll('.conf-btn');
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    
    // Marcamos el actual en verde
    btnPulsado.classList.add('active');

    // Actualizar ventana de usuario bilingüe
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
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
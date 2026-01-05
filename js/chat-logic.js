// Variable global para guardar la configuración
let currentMigoConfig = {
    rigor: 'Estricto',
    estilo: 'Normal'
};

function updateConfig(type, value) {
    // Actualizar objeto global
    currentMigoConfig[type] = value;
    
    // Actualizar visualmente los botones en la ventana de config
    const buttons = event.target.parentElement.querySelectorAll('.conf-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Reflejar en la ventana de usuario si está abierta o al abrirse
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
    }
    
    console.log("Configuración actualizada:", currentMigoConfig);
}

// Función de traducción corregida (manteniendo tu éxito actual)
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;
    outputDiv.innerText = "Traduciendo...";
    const langPair = mode === 'es-en' ? 'es|en' : 'en|es';

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${langPair}&mt=1&de=example@migo.com`);
        const data = await response.json();
        if (data.responseData) {
            outputDiv.innerText = data.responseData.translatedText;
        }
    } catch (error) {
        outputDiv.innerText = "Error de conexión";
    }
}
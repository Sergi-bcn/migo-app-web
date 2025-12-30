// Abrir y cerrar paneles
function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    document.getElementById('record-panel').classList.toggle('active');
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

// Función principal para traducir y detectar errores
async function translateText() {
    const input = document.querySelector('#translator-panel textarea');
    const resultDiv = document.getElementById('translate-result');
    const text = input.value.trim();

    if (!text) return;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });

        const data = await response.json();

        // 1. Mostrar la traducción
        if(resultDiv) resultDiv.innerText = data.translation;

        // 2. Si hay error, crear el RECTÁNGULO CERRADO en el Record
        if (data.mistake) {
            addErrorToRecord(data.mistake, data.correction);
        }

    } catch (err) {
        console.error("Fallo en la API:", err);
    }
}

// Función para insertar el diseño de rectángulo que pediste
function addErrorToRecord(bad, good) {
    const container = document.getElementById('error-log-container');
    const errorBox = document.createElement('div');
    errorBox.className = 'error-box'; // Usa el estilo del CSS anterior
    
    errorBox.innerHTML = `
        <span class="wrong">Mistake: ${bad}</span>
        <span class="correct">Correction: ${good}</span>
    `;
    
    container.prepend(errorBox);
}

// Escuchar cuando el usuario deja de escribir para traducir automáticamente
let timeout = null;
document.querySelector('#translator-panel textarea').addEventListener('keyup', () => {
    clearTimeout(timeout);
    timeout = setTimeout(translateText, 1000); // Traduce tras 1 segundo de silencio
});
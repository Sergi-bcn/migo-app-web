function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    document.getElementById('record-panel').classList.toggle('active');
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

// Función para añadir errores al historial
function addError(error, correccion) {
    const container = document.getElementById('error-log-container');
    const box = document.createElement('div');
    box.className = 'error-box';
    box.innerHTML = `
        <span class="wrong">${error}</span>
        <span class="correct">${correccion}</span>
    `;
    container.prepend(box);
}

// Ejemplo al cargar
window.onload = () => {
    addError("Ejemplo: I has a pen", "I have a pen");
};
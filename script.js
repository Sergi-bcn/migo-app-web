function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    document.getElementById('record-panel').classList.toggle('active');
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

/**
 * Registra un error y su corrección en el panel de Record
 */
function logNewError(incorrecto, correcto) {
    const container = document.getElementById('error-log-container');
    const box = document.createElement('div');
    box.className = 'error-box';
    
    box.innerHTML = `
        <span class="mistake">Error: ${incorrecto}</span>
        <span class="correction">Correcto: ${correcto}</span>
    `;
    
    container.prepend(box); // Muestra el más reciente arriba
}

// Ejemplo: Se registra un error al cargar la página para probar el diseño
window.onload = () => {
    logNewError("He have a car", "He has a car");
};